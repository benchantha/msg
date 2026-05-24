<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class DriverVehicle extends BaseModel
{
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'uuid',
        'client_id',
        'vehicle_type_id',
        'doc_vehicle_id_url',
        'doc_vehicle_inspection_cert_url',
        'plat_number',
        'color',
        'year',
        'model',
        'vehicle_picture_urls',
        'is_active',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'year' => 'integer',
            'is_active' => 'boolean',
            'vehicle_picture_urls' => 'array',
        ];
    }

    /**
     * Get the client (driver) that owns the vehicle.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<\App\Models\Client>
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    /**
     * Get the vehicle type.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<\App\Models\VehicleType>
     */
    public function vehicleType(): BelongsTo
    {
        return $this->belongsTo(VehicleType::class);
    }
}
