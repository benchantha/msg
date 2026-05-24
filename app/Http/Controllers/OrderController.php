<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Repositories\OrderRepository;
use App\Repositories\CompanyRepository;
use App\Repositories\ClientRepository;
use App\Repositories\VehicleTypeRepository;
use App\Services\OrderAssignmentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function __construct(
        protected OrderRepository $orderRepository,
        protected CompanyRepository $companyRepository,
        protected ClientRepository $clientRepository,
        protected VehicleTypeRepository $vehicleTypeRepository,
        protected OrderAssignmentService $orderAssignmentService
    ) {
    }

    /**
     * Display a listing of orders.
     */
    public function index(Request $request): Response
    {
        $orders = $this->orderRepository->getList($request);
        $companies = $this->companyRepository->getForSelect();
        $customers = $this->clientRepository->getForSelect('customer');
        $drivers = $this->clientRepository->getForSelect('driver');
        $vehicleTypes = $this->vehicleTypeRepository->getForSelect();

        return Inertia::render('Order', [
            'orders' => $orders,
            'companies' => $companies,
            'customers' => $customers,
            'drivers' => $drivers,
            'vehicleTypes' => $vehicleTypes,
            'search' => $request->input('search'),
            'filter_status' => $request->input('filter_status', ''),
            'filter_service_type' => $request->input('filter_service_type', ''),
            'filter_company_id' => $request->input('filter_company_id', ''),
        ]);
    }

    /**
     * Store a newly created order.
     */
    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateOrder($request);
        $locations = $this->validateLocations($request->input('locations', []));
        if (empty($locations) || !$this->hasPickupAndDropoff($locations)) {
            return back()->with('error', 'At least one pickup and one dropoff location are required.');
        }
        $data['locations'] = $locations;
        $this->orderRepository->create($data);

        return back()->with('success', 'Order created.');
    }

    /**
     * Update the specified order.
     */
    public function update(Request $request, Order $order): RedirectResponse
    {
        $data = $this->validateOrder($request, $order);
        $data['id'] = $order->id;
        if ($request->has('locations')) {
            $locations = $this->validateLocations($request->input('locations', []));
            if (!empty($locations) && !$this->hasPickupAndDropoff($locations)) {
                return back()->with('error', 'At least one pickup and one dropoff location are required.');
            }
            $data['locations'] = $locations;
        }
        $this->orderRepository->update($data);

        return back()->with('success', 'Order updated.');
    }

    /**
     * Remove the specified order.
     */
    public function destroy(Order $order): RedirectResponse
    {
        if (!in_array($order->status, ['pending', 'cancelled'])) {
            return back()->with('error', 'Only pending or cancelled orders can be deleted.');
        }
        $order->delete();
        return back()->with('success', 'Order deleted.');
    }

    /**
     * Assign multiple orders to a single driver.
     */
    public function assignDriver(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'order_ids' => ['required', 'array'],
            'order_ids.*' => ['integer', 'exists:orders,id'],
            'driver_id' => ['required', 'integer', 'exists:clients,id'],
            'company_id' => ['required', 'integer', 'exists:companies,id'],
            'vehicle_type_id' => ['nullable', 'integer', 'exists:vehicle_types,id'],
            'driver_vehicle_id' => ['nullable', 'integer', 'exists:driver_vehicles,id'],
        ]);

        try {
            $this->orderAssignmentService->assignMultipleOrdersToDriver(
                orderIds: $data['order_ids'],
                driverId: $data['driver_id'],
                companyId: $data['company_id'],
                vehicleTypeId: $data['vehicle_type_id'] ?? null,
                driverVehicleId: $data['driver_vehicle_id'] ?? null,
                actorId: null,
                actorType: 'admin'
            );
        } catch (\InvalidArgumentException $e) {
            return back()->with('error', $e->getMessage());
        }

        return back()->with('success', count($data['order_ids']) . ' order(s) assigned to driver.');
    }

    protected function validateOrder(Request $request, ?Order $order = null): array
    {
        $companyId = $order?->company_id ?? $request->input('company_id');
        $codeRule = ['nullable', 'string', 'max:255'];
        if ($request->filled('code')) {
            if ($order) {
                $codeRule[] = Rule::unique('orders', 'code')->where('company_id', $companyId)->ignore($order->id);
            } else {
                $codeRule[] = Rule::unique('orders', 'code')->where('company_id', $companyId);
            }
        }

        return $request->validate([
            'code' => $codeRule,
            'service_type' => ['required', Rule::in(['delivery', 'taxi'])],
            'company_id' => ['required', 'integer', 'exists:companies,id'],
            'customer_id' => ['required', 'integer', 'exists:clients,id'],
            'status' => ['sometimes', Rule::in(['pending', 'assigned', 'driver_arrived', 'departed', 'completed', 'cancelled'])],
            'distance' => ['nullable', 'numeric', 'min:0'],
            'estimated_duration' => ['nullable', 'integer', 'min:0'],
            'actual_duration' => ['nullable', 'integer', 'min:0'],
            'item_size' => ['nullable', Rule::in(['XS', 'S', 'M', 'L', 'XL', 'XXL'])],
            'item_weight' => ['nullable', 'numeric', 'min:0'],
            'item_type' => ['nullable', Rule::in(['Document', 'Food', 'Clothing', 'Electronics', 'Furniture'])],
            'item_description' => ['nullable', 'string'],
            'is_fragile' => ['sometimes', 'boolean'],
            'requires_signature' => ['sometimes', 'boolean'],
            'requires_photo' => ['sometimes', 'boolean'],
            'passenger_count' => ['nullable', 'integer', 'min:0'],
            'passenger_names' => ['nullable', 'array'],
            'passenger_names.*' => ['string'],
            'special_requirements' => ['nullable', 'array'],
            'luggage_count' => ['nullable', 'integer', 'min:0'],
            'estimated_price' => ['nullable', 'numeric', 'min:0'],
            'final_price' => ['nullable', 'numeric', 'min:0'],
            'price_breakdown' => ['nullable', 'array'],
            'payment_timing' => ['sometimes', Rule::in(['prepaid', 'postpaid'])],
            'payment_status' => ['sometimes', Rule::in(['unpaid', 'paid'])],
            'payment_method' => ['nullable', Rule::in(['cash', 'wallet'])],
            'priority' => ['sometimes', Rule::in(['normal', 'urgent', 'express'])],
            'note' => ['nullable', 'string'],
            'special_instructions' => ['nullable', 'string'],
            'is_active' => ['sometimes', 'boolean'],
        ]);
    }

    protected function validateLocations(array $locations): array
    {
        $validated = [];
        foreach ($locations as $loc) {
            $v = validator($loc, [
                'type' => ['required', Rule::in(['pickup', 'dropoff'])],
                'sequence' => ['required', 'integer', 'min:1'],
                'latitude' => ['required', 'numeric', 'between:-90,90'],
                'longitude' => ['required', 'numeric', 'between:-180,180'],
                'address' => ['required', 'string'],
                'contact_name' => ['nullable', 'string', 'max:255'],
                'contact_phone' => ['nullable', 'string', 'max:255'],
                'notes' => ['nullable', 'string'],
            ])->validate();
            $validated[] = $v;
        }
        return $validated;
    }

    protected function hasPickupAndDropoff(array $locations): bool
    {
        $hasPickup = collect($locations)->contains('type', 'pickup');
        $hasDropoff = collect($locations)->contains('type', 'dropoff');
        return $hasPickup && $hasDropoff;
    }
}
