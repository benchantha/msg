<?php

namespace App\Models;

class Trip extends BaseModel
{
    protected $fillable = [
        'uuid',
        'code',
        'company_id',
        'driver_id',
        'vehicle_type_id',
        'driver_vehicle_id',
        'status',
        'distance',
        'estimated_duration',
        'duration',
        'total_earnings',
        'road_data',
        'started_at',
        'completed_at',
        'cancelled_at',
        'cancelled_by_id',
        'cancelled_by_type',
        'cancelled_reason',
        'average_rating',
        'total_ratings',
    ];

    protected function casts(): array
    {
        return [
            'road_data' => 'array',
            'distance' => 'decimal:2',
            'total_earnings' => 'decimal:2',
            'average_rating' => 'decimal:2',
            'estimated_duration' => 'integer',
            'duration' => 'integer',
            'total_ratings' => 'integer',
            'started_at' => 'datetime',
            'completed_at' => 'datetime',
            'cancelled_at' => 'datetime',
        ];
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function driver()
    {
        return $this->belongsTo(Client::class, 'driver_id');
    }

    public function vehicleType()
    {
        return $this->belongsTo(VehicleType::class);
    }

    public function driverVehicle()
    {
        return $this->belongsTo(DriverVehicle::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function orderActions()
    {
        return $this->hasMany(OrderAction::class);
    }

    public function cancelledBy()
    {
        return $this->belongsTo(Client::class, 'cancelled_by_id');
    }
}
