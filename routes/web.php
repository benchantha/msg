<?php

use App\Http\Controllers\CompanyController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\DriverVehicleController;
use App\Http\Controllers\VehicleTypeController;
use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route(auth()->check() ? 'dashboard' : 'login');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/company', [CompanyController::class, 'index'])->name('company.index');
    Route::post('/company', [CompanyController::class, 'store'])->name('company.store');
    Route::put('/company/{company}', [CompanyController::class, 'update'])->name('company.update');
    Route::delete('/company/{company}', [CompanyController::class, 'destroy'])->name('company.destroy');

    Route::get('/clients', [ClientController::class, 'index'])->name('clients.index');
    Route::post('/clients', [ClientController::class, 'store'])->name('clients.store');
    Route::put('/clients/{client}', [ClientController::class, 'update'])->name('clients.update');
    Route::delete('/clients/{client}', [ClientController::class, 'destroy'])->name('clients.destroy');

    Route::get('/vehicle-types', [VehicleTypeController::class, 'index'])->name('vehicle-types.index');
    Route::post('/vehicle-types', [VehicleTypeController::class, 'store'])->name('vehicle-types.store');
    Route::put('/vehicle-types/{vehicleType}', [VehicleTypeController::class, 'update'])->name('vehicle-types.update');
    Route::delete('/vehicle-types/{vehicleType}', [VehicleTypeController::class, 'destroy'])->name('vehicle-types.destroy');

    Route::get('/driver-vehicles', [DriverVehicleController::class, 'index'])->name('driver-vehicles.index');
    Route::post('/driver-vehicles', [DriverVehicleController::class, 'store'])->name('driver-vehicles.store');
    Route::put('/driver-vehicles/{driverVehicle}', [DriverVehicleController::class, 'update'])->name('driver-vehicles.update');
    Route::delete('/driver-vehicles/{driverVehicle}', [DriverVehicleController::class, 'destroy'])->name('driver-vehicles.destroy');

    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
    Route::put('/orders/{order}', [OrderController::class, 'update'])->name('orders.update');
    Route::delete('/orders/{order}', [OrderController::class, 'destroy'])->name('orders.destroy');
    Route::post('/orders/assign-driver', [OrderController::class, 'assignDriver'])->name('orders.assign-driver');

    Route::get('/settings', function () {
        return Inertia::render('Settings');
    })->name('settings');
});

require __DIR__.'/auth.php';
