<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderLocation extends Model
{
    protected $fillable = [
        'order_id',
        'type',
        'sequence',
        'latitude',
        'longitude',
        'address',
        'contact_name',
        'contact_phone',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
            'sequence' => 'integer',
        ];
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function isPickup(): bool
    {
        return $this->type === 'pickup';
    }

    public function isDropoff(): bool
    {
        return $this->type === 'dropoff';
    }
}
