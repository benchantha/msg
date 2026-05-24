<?php

namespace App\Repositories;

use App\Models\Client;
use Illuminate\Http\Request;

class ClientRepository extends BaseRepository
{
  public function __construct()
  {
    parent::__construct(Client::class);
  }

  /**
   * Get a simple list of clients for selects/comboboxes.
   *
   * @param string|null $type Filter by client type (e.g. 'driver')
   * @return \Illuminate\Support\Collection<\App\Models\Client>
   */
  public function getForSelect(?string $type = null)
  {
    $query = Client::query()
      ->select(['id', 'first_name', 'last_name', 'account_code'])
      ->where('is_active', true)
      ->orderBy('first_name');

    if ($type) {
      $query->where('type', $type);
    }

    return $query->get();
  }

  public function getList(Request $request)
  {
    $perPage = (int) $request->input('per_page', 10);
    $perPage = in_array($perPage, [10, 25, 50, 100], true) ? $perPage : 10;
    $search = $request->input('search');
    $filterGender = $request->input('filter_gender');
    $filterType = $request->input('filter_type');
    $filterStatus = $request->input('filter_status');

    $query = Client::query()
        ->with('company')
        ->orderByDesc('created_at');

    if (!empty($search)) {
        $query->where(function ($q) use ($search) {
            $q->where('account_code', 'like', '%' . $search . '%')
                ->orWhere('first_name', 'like', '%' . $search . '%')
                ->orWhere('last_name', 'like', '%' . $search . '%')
                ->orWhere('phone', 'like', '%' . $search . '%')
                ->orWhere('type', 'like', '%' . $search . '%');
        });
    }

    if (!empty($filterGender)) {
        $query->where('gender', $filterGender);
    }
    if (!empty($filterType)) {
        $query->where('type', $filterType);
    }
    if (!empty($filterStatus)) {
        $query->where('status', $filterStatus);
    }

    $clients = $query->paginate($perPage)->withQueryString();

    return $clients;
  }
}
