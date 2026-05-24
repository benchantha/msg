<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VehicleType extends BaseModel
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'uuid',
        'code',
        'company_id',
        'title',
        'title_1',
        'title_2',
        'picture_url',
        'order',
        'capacity_unit',
        'capacity',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'order' => 'integer',
            'capacity' => 'decimal:2',
        ];
    }

    /**
     * Get the company that the vehicle type belongs to.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<\App\Models\Company>
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }
}
