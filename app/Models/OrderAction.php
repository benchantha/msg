<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderAction extends Model
{
    protected $fillable = [
        'order_id',
        'trip_id',
        'action_type',
        'from_status',
        'to_status',
        'latitude',
        'longitude',
        'address',
        'accuracy',
        'photo_url',
        'signature_url',
        'signature_name',
        'metadata',
        'notes',
        'actor_id',
        'actor_type',
    ];

    protected function casts(): array
    {
        return [
            'metadata' => 'array',
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
            'accuracy' => 'decimal:2',
        ];
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function trip()
    {
        return $this->belongsTo(Trip::class);
    }

    public function actor()
    {
        return $this->belongsTo(Client::class, 'actor_id');
    }
}
