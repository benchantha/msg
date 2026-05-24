<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use App\Repositories\CompanyRepository;

class CompanyController extends Controller
{

    protected $companyRepository;

    public function __construct(CompanyRepository $companyRepository)
    {
        $this->companyRepository = $companyRepository;
    }

    /**
     * Display a listing of the companies.
     */
    public function index(Request $request): Response
    {
        $companies = $this->companyRepository->getList($request);
        return Inertia::render('Company', [
            'companies' => $companies,
            'search' => $request->input('search'),
        ]);
    }

    /**
     * Store a newly created company.
     */
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'code' => ['required', 'string', 'max:255', 'unique:companies,code'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_public' => ['sometimes', 'boolean'],
            'is_active' => ['sometimes', 'boolean'],
            'logo_url' => ['nullable', 'string', 'max:2048'],
        ]);

        $data['is_public'] = $request->boolean('is_public');
        $data['is_active'] = $request->boolean('is_active', true);

        $this->companyRepository->create($data);

        return back()->with('success', 'Company created.');
    }

    /**
     * Update the specified company.
     */
    public function update(Request $request, Company $company): RedirectResponse
    {
        // Example: Return 404 if company not found (Laravel route model binding handles this automatically)
        // If you need custom 404 handling:
        // if (!$company) {
        //     abort(404, 'Company not found');
        // }

        $data = $request->validate([
            'code' => [
                'required',
                'string',
                'max:255',
                Rule::unique('companies', 'code')->ignore($company->id),
            ],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_public' => ['sometimes', 'boolean'],
            'is_active' => ['sometimes', 'boolean'],
            'logo_url' => ['nullable', 'string', 'max:2048'],
        ]);

        $data['is_public'] = $request->boolean('is_public');
        $data['is_active'] = $request->boolean('is_active', true);
        $data['id'] = $company->id;

        // Example: Return 500 error for testing
        // if (someCondition) {
        //     abort(500, 'Internal server error occurred');
        // }

        $this->companyRepository->update($data);

        return back()->with('success', 'Company updated.');
    }

    /**
     * Remove the specified company.
     */
    public function destroy(Company $company): RedirectResponse
    {
        // Example: Return 404 if company not found
        // if (!$company) {
        //     abort(404, 'Company not found');
        // }

        // Example: Return 403 if user doesn't have permission
        // if (!auth()->user()->can('delete', $company)) {
        //     abort(403, 'You do not have permission to delete this company');
        // }

        $this->companyRepository->delete($company->id);

        return back()->with('success', 'Company deleted.');
    }
}

