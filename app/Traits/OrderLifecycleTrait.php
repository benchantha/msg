<?php

namespace App\Traits;

use App\Models\OrderAction;
use Illuminate\Support\Facades\DB;

trait OrderLifecycleTrait
{
    /**
     * Valid status transitions for order lifecycle.
     */
    protected static array $validTransitions = [
        'pending' => ['assigned', 'cancelled'],
        'assigned' => ['driver_arrived', 'cancelled'],
        'driver_arrived' => ['departed', 'cancelled'],
        'departed' => ['completed', 'cancelled'],
        'completed' => [],
        'cancelled' => [],
    ];

    /**
     * Step 1 → 2: Assign driver to order (pending → assigned).
     */
    public function assignDriver(?int $tripId = null, ?int $actorId = null, ?string $actorType = null, ?string $notes = null): bool
    {
        return $this->transitionStatus('assigned', 'driver_assigned', [
            'trip_id' => $tripId,
            'actor_id' => $actorId,
            'actor_type' => $actorType ?? 'admin',
            'notes' => $notes,
            'assigned_at' => now(),
            'order_trip_id' => $tripId,
        ]);
    }

    /**
     * Step 2 → 3: Mark driver arrived at pickup (assigned → driver_arrived).
     */
    public function markDriverArrived(?float $latitude = null, ?float $longitude = null, ?string $address = null, ?float $accuracy = null, ?int $actorId = null, ?string $actorType = null, ?string $notes = null): bool
    {
        return $this->transitionStatus('driver_arrived', 'driver_arrived', [
            'latitude' => $latitude,
            'longitude' => $longitude,
            'address' => $address,
            'accuracy' => $accuracy,
            'actor_id' => $actorId,
            'actor_type' => $actorType ?? 'driver',
            'notes' => $notes,
            'driver_arrived_at' => now(),
        ]);
    }

    /**
     * Step 3 → 4: Mark departed from pickup (driver_arrived → departed).
     */
    public function markDeparted(?int $actorId = null, ?string $actorType = null, ?string $notes = null): bool
    {
        return $this->transitionStatus('departed', 'departed', [
            'actor_id' => $actorId,
            'actor_type' => $actorType ?? 'driver',
            'notes' => $notes,
            'departed_at' => now(),
        ]);
    }

    /**
     * Step 4 → 5: Complete order (departed → completed).
     */
    public function complete(?string $photoUrl = null, ?string $signatureUrl = null, ?string $signatureName = null, ?int $actorId = null, ?string $actorType = null, ?string $notes = null): bool
    {
        return $this->transitionStatus('completed', 'completed', [
            'photo_url' => $photoUrl,
            'signature_url' => $signatureUrl,
            'signature_name' => $signatureName,
            'actor_id' => $actorId,
            'actor_type' => $actorType ?? 'driver',
            'notes' => $notes,
            'completed_at' => now(),
        ]);
    }

    /**
     * Cancel order (any status → cancelled).
     */
    public function cancel(?int $cancelledById = null, ?string $cancelledByType = null, ?string $reason = null, ?string $notes = null): bool
    {
        $fromStatus = $this->status;

        if ($fromStatus === 'cancelled') {
            return false;
        }

        return DB::transaction(function () use ($fromStatus, $cancelledById, $cancelledByType, $reason, $notes) {
            $this->update([
                'status' => 'cancelled',
                'cancelled_at' => now(),
                'cancelled_by_id' => $cancelledById,
                'cancelled_by_type' => $cancelledByType ?? 'system',
                'cancelled_reason' => $reason,
            ]);

            $this->orderActions()->create([
                'trip_id' => $this->trip_id,
                'action_type' => 'cancelled',
                'from_status' => $fromStatus,
                'to_status' => 'cancelled',
                'actor_id' => $cancelledById,
                'actor_type' => $cancelledByType ?? 'system',
                'notes' => $notes,
            ]);

            return true;
        });
    }

    /**
     * Record location update (no status change).
     */
    public function recordLocationUpdate(float $latitude, float $longitude, ?string $address = null, ?float $accuracy = null, ?int $actorId = null, ?string $actorType = null, ?array $metadata = null): OrderAction
    {
        return $this->orderActions()->create([
            'trip_id' => $this->trip_id,
            'action_type' => 'location_update',
            'from_status' => $this->status,
            'to_status' => $this->status,
            'latitude' => $latitude,
            'longitude' => $longitude,
            'address' => $address,
            'accuracy' => $accuracy,
            'actor_id' => $actorId,
            'actor_type' => $actorType ?? 'driver',
            'metadata' => $metadata,
        ]);
    }

    /**
     * Mark payment completed (no status change).
     */
    public function markPaymentCompleted(?string $paymentMethod = null, ?int $actorId = null, ?string $actorType = null, ?array $metadata = null): OrderAction
    {
        $this->update([
            'payment_status' => 'paid',
            'payment_method' => $paymentMethod ?? $this->payment_method,
        ]);

        return $this->orderActions()->create([
            'trip_id' => $this->trip_id,
            'action_type' => 'payment_completed',
            'from_status' => $this->status,
            'to_status' => $this->status,
            'actor_id' => $actorId,
            'actor_type' => $actorType ?? 'driver',
            'metadata' => $metadata,
        ]);
    }

    /**
     * Record customer rating (no status change).
     */
    public function recordCustomerRating(int $rating, ?string $comment = null, ?int $actorId = null): OrderAction
    {
        $this->update([
            'rating' => $rating,
            'rating_comment' => $comment,
            'rating_at' => now(),
        ]);

        return $this->orderActions()->create([
            'trip_id' => $this->trip_id,
            'action_type' => 'customer_rated',
            'from_status' => $this->status,
            'to_status' => $this->status,
            'actor_id' => $actorId,
            'actor_type' => 'customer',
            'metadata' => ['rating' => $rating, 'comment' => $comment],
        ]);
    }

    /**
     * Core status transition with OrderAction logging.
     */
    protected function transitionStatus(string $toStatus, string $actionType, array $extra = []): bool
    {
        $fromStatus = $this->status;

        if (!$this->canTransitionTo($toStatus)) {
            return false;
        }

        $orderFillable = ['trip_id', 'assigned_at', 'driver_arrived_at', 'departed_at', 'completed_at'];
        $actionFillable = ['trip_id', 'action_type', 'from_status', 'to_status', 'latitude', 'longitude', 'address', 'accuracy', 'photo_url', 'signature_url', 'signature_name', 'metadata', 'notes', 'actor_id', 'actor_type'];

        $orderUpdates = array_intersect_key($extra, array_flip($orderFillable));
        if (isset($extra['order_trip_id'])) {
            $orderUpdates['trip_id'] = $extra['order_trip_id'];
        }
        $actionExtra = array_intersect_key($extra, array_flip($actionFillable));

        return DB::transaction(function () use ($fromStatus, $toStatus, $actionType, $orderUpdates, $actionExtra) {
            $this->update(array_merge(['status' => $toStatus], $orderUpdates));

            $this->orderActions()->create(array_merge([
                'trip_id' => $this->trip_id,
                'action_type' => $actionType,
                'from_status' => $fromStatus,
                'to_status' => $toStatus,
            ], $actionExtra));

            return true;
        });
    }

    /**
     * Check if order can transition to given status.
     */
    public function canTransitionTo(string $toStatus): bool
    {
        $fromStatus = $this->status;

        if ($toStatus === $fromStatus) {
            return false;
        }

        $allowed = self::$validTransitions[$fromStatus] ?? [];

        return in_array($toStatus, $allowed);
    }

    /**
     * Get current step number (1-5) or null if cancelled.
     */
    public function getCurrentStep(): ?int
    {
        return match ($this->status) {
            'pending' => 1,
            'assigned' => 2,
            'driver_arrived' => 3,
            'departed' => 4,
            'completed' => 5,
            'cancelled' => null,
            default => null,
        };
    }

    /**
     * Check if order is in a terminal state.
     */
    public function isTerminal(): bool
    {
        return in_array($this->status, ['completed', 'cancelled']);
    }
}
