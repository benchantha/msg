<?php

namespace App\Http\Controllers;

use App\Models\DriverVehicle;
use App\Repositories\ClientRepository;
use App\Repositories\DriverVehicleRepository;
use App\Repositories\VehicleTypeRepository;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class DriverVehicleController extends Controller
{
    protected DriverVehicleRepository $driverVehicleRepository;
    protected ClientRepository $clientRepository;
    protected VehicleTypeRepository $vehicleTypeRepository;

    public function __construct(
        DriverVehicleRepository $driverVehicleRepository,
        ClientRepository $clientRepository,
        VehicleTypeRepository $vehicleTypeRepository
    ) {
        $this->driverVehicleRepository = $driverVehicleRepository;
        $this->clientRepository = $clientRepository;
        $this->vehicleTypeRepository = $vehicleTypeRepository;
    }

    /**
     * Display a listing of the driver vehicles.
     */
    public function index(Request $request): Response
    {
        $driverVehicles = $this->driverVehicleRepository->getList($request);
        $clients = $this->clientRepository->getForSelect('driver');
        $vehicleTypes = $this->vehicleTypeRepository->getForSelect();

        return Inertia::render('DriverVehicle', [
            'driverVehicles' => $driverVehicles,
            'clients' => $clients,
            'vehicleTypes' => $vehicleTypes,
            'search' => $request->input('search'),
            'filterVehicleType' => $request->input('filter_vehicle_type'),
        ]);
    }

    /**
     * Store a newly created driver vehicle.
     */
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'client_id' => ['required', 'integer', 'exists:clients,id'],
            'vehicle_type_id' => [
                'required',
                'integer',
                'exists:vehicle_types,id',
                Rule::unique('driver_vehicles', 'vehicle_type_id')
                    ->where('client_id', $request->input('client_id'))
                    ->whereNull('deleted_at'),
            ],
            'plat_number' => ['required', 'string', 'max:50'],
            'color' => ['nullable', 'string', 'max:50'],
            'year' => ['nullable', 'integer', 'min:1900', 'max:2100'],
            'model' => ['nullable', 'string', 'max:100'],
            'doc_vehicle_id_url' => ['nullable', 'string', 'max:2048'],
            'doc_vehicle_inspection_cert_url' => ['nullable', 'string', 'max:2048'],
            'is_active' => ['nullable', 'boolean'],
        ], [
            'vehicle_type_id.unique' => 'This driver already has a vehicle of this type. Each driver can have only one vehicle per vehicle type.',
        ]);

        $data['is_active'] = $request->boolean('is_active', true);

        $this->driverVehicleRepository->create($data);

        return back()->with('success', 'Driver vehicle created.');
    }

    /**
     * Update the specified driver vehicle.
     */
    public function update(Request $request, DriverVehicle $driverVehicle): RedirectResponse
    {
        $data = $request->validate([
            'client_id' => ['required', 'integer', 'exists:clients,id'],
            'vehicle_type_id' => [
                'required',
                'integer',
                'exists:vehicle_types,id',
                Rule::unique('driver_vehicles', 'vehicle_type_id')
                    ->where('client_id', $request->input('client_id'))
                    ->whereNull('deleted_at')
                    ->ignore($driverVehicle->id),
            ],
            'plat_number' => ['required', 'string', 'max:50'],
            'color' => ['nullable', 'string', 'max:50'],
            'year' => ['nullable', 'integer', 'min:1900', 'max:2100'],
            'model' => ['nullable', 'string', 'max:100'],
            'doc_vehicle_id_url' => ['nullable', 'string', 'max:2048'],
            'doc_vehicle_inspection_cert_url' => ['nullable', 'string', 'max:2048'],
            'is_active' => ['nullable', 'boolean'],
        ], [
            'vehicle_type_id.unique' => 'This driver already has a vehicle of this type. Each driver can have only one vehicle per vehicle type.',
        ]);

        $data['id'] = $driverVehicle->id;
        $data['is_active'] = $request->boolean('is_active', true);

        $this->driverVehicleRepository->update($data);

        return back()->with('success', 'Driver vehicle updated.');
    }

    /**
     * Remove the specified driver vehicle.
     */
    public function destroy(DriverVehicle $driverVehicle): RedirectResponse
    {
        $this->driverVehicleRepository->delete($driverVehicle->id);

        return back()->with('success', 'Driver vehicle deleted.');
    }
}
