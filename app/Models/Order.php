<?php

namespace App\Models;

use App\Traits\OrderLifecycleTrait;

class Order extends BaseModel
{
    use OrderLifecycleTrait;
    protected $fillable = [
        'uuid',
        'code',
        'service_type',
        'company_id',
        'customer_id',
        'trip_id',
        'status',
        'distance',
        'estimated_duration',
        'actual_duration',
        'pickup_road_data',
        'dropoff_road_data',
        'item_size',
        'item_weight',
        'item_type',
        'item_description',
        'is_fragile',
        'requires_signature',
        'requires_photo',
        'passenger_count',
        'passenger_names',
        'special_requirements',
        'luggage_count',
        'estimated_price',
        'final_price',
        'price_breakdown',
        'payment_timing',
        'payment_status',
        'payment_method',
        'priority',
        'note',
        'special_instructions',
        'rating',
        'rating_comment',
        'rating_at',
        'cancelled_at',
        'cancelled_by_id',
        'cancelled_by_type',
        'cancelled_reason',
        'is_active',
        'assigned_at',
        'driver_arrived_at',
        'departed_at',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'pickup_road_data' => 'array',
            'dropoff_road_data' => 'array',
            'passenger_names' => 'array',
            'special_requirements' => 'array',
            'price_breakdown' => 'array',
            'distance' => 'decimal:2',
            'item_weight' => 'decimal:2',
            'estimated_price' => 'decimal:2',
            'final_price' => 'decimal:2',
            'estimated_duration' => 'integer',
            'actual_duration' => 'integer',
            'passenger_count' => 'integer',
            'luggage_count' => 'integer',
            'rating' => 'integer',
            'is_fragile' => 'boolean',
            'requires_signature' => 'boolean',
            'requires_photo' => 'boolean',
            'is_active' => 'boolean',
            'assigned_at' => 'datetime',
            'driver_arrived_at' => 'datetime',
            'departed_at' => 'datetime',
            'completed_at' => 'datetime',
            'rating_at' => 'datetime',
            'cancelled_at' => 'datetime',
        ];
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function customer()
    {
        return $this->belongsTo(Client::class, 'customer_id');
    }

    public function trip()
    {
        return $this->belongsTo(Trip::class);
    }

    public function orderActions()
    {
        return $this->hasMany(OrderAction::class);
    }

    public function locations()
    {
        return $this->hasMany(OrderLocation::class);
    }

    public function pickupLocation()
    {
        return $this->hasOne(OrderLocation::class)->where('type', 'pickup')->where('sequence', 1);
    }

    public function dropoffLocation()
    {
        return $this->hasOne(OrderLocation::class)->where('type', 'dropoff')->where('sequence', 1);
    }

    public function cancelledBy()
    {
        return $this->belongsTo(Client::class, 'cancelled_by_id');
    }

    public function isDelivery(): bool
    {
        return $this->service_type === 'delivery';
    }

    public function isTaxi(): bool
    {
        return $this->service_type === 'taxi';
    }
}
