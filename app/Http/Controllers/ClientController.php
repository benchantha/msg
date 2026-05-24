<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Repositories\ClientRepository;
use App\Repositories\CompanyRepository;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ClientController extends Controller
{
    protected ClientRepository $clientRepository;
    protected CompanyRepository $companyRepository;

    public function __construct(ClientRepository $clientRepository, CompanyRepository $companyRepository)
    {
        $this->clientRepository = $clientRepository;
        $this->companyRepository = $companyRepository;
    }

    /**
     * Display a listing of the clients.
     */
    public function index(Request $request): Response
    {
        $clients = $this->clientRepository->getList($request);
        $companies = $this->companyRepository->getForSelect();

        return Inertia::render('Client', [
            'clients' => $clients,
            'search' => $request->input('search'),
            'companies' => $companies,
            'filterGender' => $request->input('filter_gender', ''),
            'filterType' => $request->input('filter_type', ''),
            'filterStatus' => $request->input('filter_status', ''),
        ]);
    }

    /**
     * Store a newly created client.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->merge([
            'company_id' => $request->filled('company_id') ? $request->input('company_id') : null,
        ]);

        $data = $request->validate([
            'account_code' => ['required', 'string', 'max:255', 'unique:clients,account_code'],
            'company_id' => ['nullable', 'integer', 'exists:companies,id'],
            'phone' => ['required', 'string', 'max:255', Rule::unique('clients', 'phone')->where('type', $request->input('type'))],
            'type' => ['required', Rule::in(['driver', 'customer', 'staff'])],
            'password' => ['required', 'string', 'min:6'],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'gender' => ['nullable', Rule::in(['male', 'female', 'other'])],
            'dob' => ['nullable', 'date'],
            'place_of_birth' => ['nullable', 'string', 'max:255'],
            'id_number' => ['nullable', 'string', 'max:255'],
            'phone_1' => ['nullable', 'string', 'max:255'],
            'phone_2' => ['nullable', 'string', 'max:255'],
            'phone_3' => ['nullable', 'string', 'max:255'],
            'phone_4' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string'],
            'avatar_url' => ['nullable', 'string', 'max:2048'],
            'is_active' => ['sometimes', 'boolean'],
            'status' => ['nullable', Rule::in(['pending', 'approved'])],
            'work_status' => ['nullable', Rule::in(['offline', 'online'])],
            'rank' => ['nullable', 'integer'],
            'is_fixed_otp' => ['sometimes', 'boolean'],
            'otp' => ['nullable', 'string', 'max:255'],
            'latitude' => ['nullable', 'numeric'],
            'longitude' => ['nullable', 'numeric'],
            'location_name' => ['nullable', 'string', 'max:255'],
            'rotation' => ['nullable', 'numeric'],
            'nick_name' => ['nullable', 'string', 'max:255'],
        ]);

        $data['is_active'] = $request->boolean('is_active', true);
        $data['is_fixed_otp'] = $request->boolean('is_fixed_otp', false);
        $data['status'] = $data['status'] ?? 'pending';
        $data['password'] = bcrypt($data['password']);

        $this->clientRepository->create($data);

        return back()->with('success', 'Client created.');
    }

    /**
     * Update the specified client.
     */
    public function update(Request $request, Client $client): RedirectResponse
    {
        $request->merge([
            'company_id' => $request->filled('company_id') ? $request->input('company_id') : null,
        ]);

        $data = $request->validate([
            'account_code' => ['required', 'string', 'max:255', Rule::unique('clients', 'account_code')->ignore($client->id)],
            'company_id' => ['nullable', 'integer', 'exists:companies,id'],
            'phone' => ['required', 'string', 'max:255', Rule::unique('clients', 'phone')->where('type', $request->input('type'))->ignore($client->id)],
            'type' => ['required', Rule::in(['driver', 'customer', 'staff'])],
            'password' => ['nullable', 'string', 'min:6'],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'gender' => ['nullable', Rule::in(['male', 'female', 'other'])],
            'dob' => ['nullable', 'date'],
            'place_of_birth' => ['nullable', 'string', 'max:255'],
            'id_number' => ['nullable', 'string', 'max:255'],
            'phone_1' => ['nullable', 'string', 'max:255'],
            'phone_2' => ['nullable', 'string', 'max:255'],
            'phone_3' => ['nullable', 'string', 'max:255'],
            'phone_4' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string'],
            'avatar_url' => ['nullable', 'string', 'max:2048'],
            'is_active' => ['sometimes', 'boolean'],
            'status' => ['nullable', Rule::in(['pending', 'approved'])],
            'work_status' => ['nullable', Rule::in(['offline', 'online'])],
            'rank' => ['nullable', 'integer'],
            'is_fixed_otp' => ['sometimes', 'boolean'],
            'otp' => ['nullable', 'string', 'max:255'],
            'latitude' => ['nullable', 'numeric'],
            'longitude' => ['nullable', 'numeric'],
            'location_name' => ['nullable', 'string', 'max:255'],
            'rotation' => ['nullable', 'numeric'],
            'nick_name' => ['nullable', 'string', 'max:255'],
        ]);

        $data['is_active'] = $request->boolean('is_active', true);
        $data['is_fixed_otp'] = $request->boolean('is_fixed_otp', false);
        $data['status'] = $data['status'] ?? 'pending';
        $data['id'] = $client->id;

        if (!empty($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        } else {
            unset($data['password']);
        }

        $this->clientRepository->update($data);

        return back()->with('success', 'Client updated.');
    }

    /**
     * Remove the specified client.
     */
    public function destroy(Client $client): RedirectResponse
    {
        $client->delete();

        return back()->with('success', 'Client deleted.');
    }
}


