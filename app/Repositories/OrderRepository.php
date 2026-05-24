<?php

namespace App\Repositories;

use App\Models\Company;
use App\Models\Order;
use App\Models\OrderLocation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderRepository extends BaseRepository
{
    public function __construct()
    {
        parent::__construct(Order::class);
    }

    public function getList(Request $request)
    {
        $perPage = (int) $request->input('per_page', 10);
        $perPage = in_array($perPage, [10, 25, 50, 100], true) ? $perPage : 10;
        $search = $request->input('search');
        $filterStatus = $request->input('filter_status');
        $filterServiceType = $request->input('filter_service_type');
        $filterCompanyId = $request->input('filter_company_id');

        $query = Order::query()
            ->with(['company', 'customer', 'trip', 'locations'])
            ->orderByDesc('created_at');

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', '%' . $search . '%')
                    ->orWhereHas('customer', fn ($cq) => $cq->where('first_name', 'like', '%' . $search . '%')
                        ->orWhere('last_name', 'like', '%' . $search . '%')
                        ->orWhere('account_code', 'like', '%' . $search . '%'));
            });
        }

        if (!empty($filterStatus)) {
            $query->where('status', $filterStatus);
        }

        if (!empty($filterServiceType)) {
            $query->where('service_type', $filterServiceType);
        }

        if (!empty($filterCompanyId)) {
            $query->where('company_id', $filterCompanyId);
        }

        return $query->paginate($perPage)->withQueryString();
    }

    /**
     * Create order with pickup and dropoff locations.
     *
     * @param array $data
     * @return \App\Models\Order
     */
    public function create($data)
    {
        return DB::transaction(function () use ($data) {
            $locations = $data['locations'] ?? [];
            unset($data['locations']);

            if (empty($data['code']) && !empty($data['company_id'])) {
                $data['code'] = $this->generateOrderCode($data['company_id']);
            }

            $order = Order::create($data);

            foreach ($locations as $loc) {
                $order->locations()->create($loc);
            }

            return $order->load('locations');
        });
    }

    /**
     * Update order and optionally locations.
     *
     * @param array $data
     * @return \App\Models\Order|bool
     */
    public function update($data)
    {
        return DB::transaction(function () use ($data) {
            $id = $data['id'] ?? null;
            if (!$id) {
                throw new \InvalidArgumentException('Order id is required for update.');
            }

            $order = Order::findOrFail($id);
            $locations = $data['locations'] ?? null;
            unset($data['id'], $data['locations']);

            $order->update($data);

            if (is_array($locations)) {
                $order->locations()->delete();
                foreach ($locations as $loc) {
                    $order->locations()->create($loc);
                }
            }

            return $order->fresh(['locations']);
        });
    }

    /**
     * Generate unique order code per company.
     * Uses row lock on company to prevent race conditions when creating orders concurrently.
     */
    public function generateOrderCode(int $companyId): string
    {
        // Lock company row to serialize code generation (must be called inside a transaction)
        Company::where('id', $companyId)->lockForUpdate()->first();

        $prefix = 'ORD-' . date('Ymd') . '-';
        $last = Order::where('company_id', $companyId)
            ->where('code', 'like', $prefix . '%')
            ->orderByDesc('id')
            ->value('code');

        $seq = 1;
        if ($last) {
            $parts = explode('-', $last);
            $seq = (int) end($parts) + 1;
        }

        return $prefix . str_pad((string) $seq, 4, '0', STR_PAD_LEFT);
    }

    /**
     * Get orders for select (e.g. pending orders for assignment).
     */
    public function getPendingForSelect(int $companyId)
    {
        return Order::query()
            ->select(['id', 'code', 'status', 'customer_id'])
            ->where('company_id', $companyId)
            ->where('status', 'pending')
            ->with('customer:id,first_name,last_name')
            ->orderBy('created_at')
            ->get();
    }
}
