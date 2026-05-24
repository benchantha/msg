<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Trip;
use Illuminate\Support\Facades\DB;

class OrderAssignmentService
{
    /**
     * Assign multiple orders to a single driver by creating a trip and linking orders.
     *
     * @param array<int> $orderIds Order IDs to assign
     * @param int $driverId Client (driver) ID
     * @param int $companyId Company ID
     * @param int|null $vehicleTypeId Optional vehicle type
     * @param int|null $driverVehicleId Optional driver vehicle
     * @param int|null $actorId Who performed the assignment (admin)
     * @param string $actorType 'admin'|'system'
     * @return Trip Created trip with assigned orders
     * @throws \InvalidArgumentException
     */
    public function assignMultipleOrdersToDriver(
        array $orderIds,
        int $driverId,
        int $companyId,
        ?int $vehicleTypeId = null,
        ?int $driverVehicleId = null,
        ?int $actorId = null,
        string $actorType = 'admin'
    ): Trip {
        if (empty($orderIds)) {
            throw new \InvalidArgumentException('At least one order is required.');
        }

        $orders = Order::whereIn('id', $orderIds)
            ->where('company_id', $companyId)
            ->where('status', 'pending')
            ->get();

        if ($orders->count() !== count($orderIds)) {
            $foundIds = $orders->pluck('id')->toArray();
            $invalid = array_diff($orderIds, $foundIds);
            throw new \InvalidArgumentException(
                'Some orders are invalid or not pending: ' . implode(', ', $invalid)
            );
        }

        return DB::transaction(function () use ($orders, $driverId, $companyId, $vehicleTypeId, $driverVehicleId, $actorId, $actorType) {
            $trip = Trip::create([
                'company_id' => $companyId,
                'driver_id' => $driverId,
                'vehicle_type_id' => $vehicleTypeId,
                'driver_vehicle_id' => $driverVehicleId,
                'status' => 'active',
                'code' => $this->generateTripCode($companyId),
            ]);

            foreach ($orders as $order) {
                $order->assignDriver(
                    tripId: $trip->id,
                    actorId: $actorId,
                    actorType: $actorType,
                    notes: 'Assigned via batch assignment'
                );
            }

            return $trip->load('orders', 'driver');
        });
    }

    protected function generateTripCode(int $companyId): string
    {
        $prefix = 'TRIP-' . date('Ymd') . '-';
        $last = Trip::where('company_id', $companyId)
            ->where('code', 'like', $prefix . '%')
            ->orderByDesc('id')
            ->value('code');

        $seq = 1;
        if ($last) {
            $parts = explode('-', $last);
            $seq = (int) end($parts) + 1;
        }

        return $prefix . str_pad((string) $seq, 4, '0', STR_PAD_LEFT);
    }
}
