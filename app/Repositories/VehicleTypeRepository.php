<?php

namespace App\Repositories;

use App\Models\VehicleType;
use Illuminate\Http\Request;

class VehicleTypeRepository extends BaseRepository
{
  public function __construct()
  {
    parent::__construct(VehicleType::class);
  }

  /**
   * Get a simple list of vehicle types for selects/comboboxes.
   *
   * @return \Illuminate\Support\Collection<\App\Models\VehicleType>
   */
  public function getForSelect()
  {
    return VehicleType::query()
      ->select(['id', 'code', 'title'])
      ->orderBy('title')
      ->get();
  }

  public function getList(Request $request)
    {
        $perPage = (int) $request->input('per_page', 10);
        $perPage = in_array($perPage, [10, 25, 50, 100], true) ? $perPage : 10;
        $search = $request->input('search');

        $query = VehicleType::query()
            ->with('company')
            ->orderByDesc('created_at');

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', '%' . $search . '%')
                    ->orWhere('title', 'like', '%' . $search . '%');
            });
        }

        return $query->paginate($perPage)->withQueryString();
    }
}
