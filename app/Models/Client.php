<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Client extends BaseModel
{
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
    ];

    protected $fillable = [
        'uuid',
        'account_code',
        'company_id',
        'phone',
        'type',
        'password',
        'first_name',
        'last_name',
        'gender',
        'dob',
        'place_of_birth',
        'id_number',
        'phone_1',
        'phone_2',
        'phone_3',
        'phone_4',
        'address',
        'avatar_url',
        'is_active',
        'status',
        'work_status',
        'rank',
        'is_fixed_otp',
        'otp',
        'latitude',
        'longitude',
        'location_name',
        'rotation',
        'nick_name',
    ];

    /**
     * Get the company that the client belongs to.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo \App\Models\Company
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class, 'company_id');
    }
}
