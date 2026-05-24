<?php

namespace App\Repositories;

use App\Models\Company;
use Illuminate\Http\Request;

class CompanyRepository extends BaseRepository
{
  public function __construct()
  {
    parent::__construct(Company::class);
  }

  /**
   * Get a simple list of companies for selects/comboboxes.
   *
   * @return \Illuminate\Support\Collection<\App\Models\Company>
   */
  public function getForSelect()
  {
      return Company::query()
          ->select(['id', 'name'])
          ->where('is_active', true)
          ->where('is_public', true)
          ->orderBy('name')
          ->get();
  }

  public function getList(Request $request)
  {
    $perPage = (int) $request->input('per_page', 10);
    $perPage = in_array($perPage, [10, 25, 50, 100], true) ? $perPage : 10;
    $search = $request->input('search');

    $query = Company::query()->orderByDesc('created_at');

    if (!empty($search)) {
        $query->where(function ($q) use ($search) {
            $q->where('code', 'like', '%' . $search . '%')
                ->orWhere('name', 'like', '%' . $search . '%');
        });
    }

    $companies = $query->paginate($perPage)->withQueryString();

    return $companies;
  }

  
}
