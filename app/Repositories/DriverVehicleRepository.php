<?php

namespace App\Repositories;

use App\Models\DriverVehicle;
use Illuminate\Http\Request;

class DriverVehicleRepository extends BaseRepository
{
    public function __construct()
    {
        parent::__construct(DriverVehicle::class);
    }

    public function getList(Request $request)
    {
        $perPage = (int) $request->input('per_page', 10);
        $perPage = in_array($perPage, [10, 25, 50, 100], true) ? $perPage : 10;
        $search = $request->input('search');
        $filterVehicleType = $request->input('filter_vehicle_type');

        $query = DriverVehicle::query()
            ->with(['client', 'vehicleType'])
            ->orderByDesc('created_at');

        if (!empty($filterVehicleType)) {
            $query->where('vehicle_type_id', $filterVehicleType);
        }

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('plat_number', 'like', '%' . $search . '%')
                    ->orWhere('color', 'like', '%' . $search . '%')
                    ->orWhere('model', 'like', '%' . $search . '%')
                    ->orWhereHas('client', function ($cq) use ($search) {
                        $cq->where('first_name', 'like', '%' . $search . '%')
                            ->orWhere('last_name', 'like', '%' . $search . '%')
                            ->orWhere('account_code', 'like', '%' . $search . '%');
                    });
            });
        }

        return $query->paginate($perPage)->withQueryString();
    }
}
