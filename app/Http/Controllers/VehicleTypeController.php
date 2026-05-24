<?php

namespace App\Http\Controllers;

use App\Models\VehicleType;
use App\Repositories\CompanyRepository;
use App\Repositories\VehicleTypeRepository;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class VehicleTypeController extends Controller
{
    protected VehicleTypeRepository $vehicleTypeRepository;
    protected CompanyRepository $companyRepository;

    public function __construct(VehicleTypeRepository $vehicleTypeRepository, CompanyRepository $companyRepository)
    {
        $this->vehicleTypeRepository = $vehicleTypeRepository;
        $this->companyRepository = $companyRepository;
    }

    /**
     * Display a listing of the vehicle types.
     */
    public function index(Request $request): Response
    {
        $vehicleTypes = $this->vehicleTypeRepository->getList($request);
        $companies = $this->companyRepository->getForSelect();

        return Inertia::render('VehicleType', [
            'vehicleTypes' => $vehicleTypes,
            'companies' => $companies,
            'search' => $request->input('search'),
        ]);
    }

    /**
     * Store a newly created vehicle type.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->merge([
            'company_id' => $request->filled('company_id') ? $request->input('company_id') : null,
        ]);
        $data = $request->validate([
            'code' => ['required', 'string', 'max:255'],
            'company_id' => ['required', 'integer', 'exists:companies,id'],
            'title' => ['required', 'string', 'max:255'],
            'title_1' => ['nullable', 'string', 'max:255'],
            'title_2' => ['nullable', 'string', 'max:255'],
            'picture_url' => ['nullable', 'string', 'max:2048'],
            'order' => ['nullable', 'integer'],
            'capacity_unit' => ['required', Rule::in(['ton', 'seat'])],
            'capacity' => ['required', 'numeric', 'min:0'],
        ]);

        $data['order'] = $data['order'] ?? 0;

        $this->vehicleTypeRepository->create($data);

        return back()->with('success', 'Vehicle type created.');
    }

    /**
     * Update the specified vehicle type.
     */
    public function update(Request $request, VehicleType $vehicleType): RedirectResponse
    {
        $request->merge([
            'company_id' => $request->filled('company_id') ? $request->input('company_id') : null,
        ]);
        $data = $request->validate([
            'code' => ['required', 'string', 'max:255'],
            'company_id' => ['required', 'integer', 'exists:companies,id'],
            'title' => ['required', 'string', 'max:255'],
            'title_1' => ['nullable', 'string', 'max:255'],
            'title_2' => ['nullable', 'string', 'max:255'],
            'picture_url' => ['nullable', 'string', 'max:2048'],
            'order' => ['nullable', 'integer'],
            'capacity_unit' => ['required', Rule::in(['ton', 'seat'])],
            'capacity' => ['required', 'numeric', 'min:0'],
        ]);

        $data['id'] = $vehicleType->id;
        $data['order'] = $data['order'] ?? 0;

        $this->vehicleTypeRepository->update($data);

        return back()->with('success', 'Vehicle type updated.');
    }

    /**
     * Remove the specified vehicle type.
     */
    public function destroy(VehicleType $vehicleType): RedirectResponse
    {
        $this->vehicleTypeRepository->delete($vehicleType->id);

        return back()->with('success', 'Vehicle type deleted.');
    }
}
