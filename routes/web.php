<?php

use App\Http\Controllers\BranchController;
use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

require __DIR__ . '/auth.php';

Route::get('/', fn() => Inertia::render('welcome'))->name('home');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', fn() => Inertia::render('dashboard'))->name('dashboard');

    Route::resource('branches', BranchController::class);

    // Rutas para órdenes
    Route::get('orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('orders/{order}/edit', [OrderController::class, 'edit'])->name('orders.edit');
    Route::put('orders/{order}', [OrderController::class, 'update'])->name('orders.update');

    // Rutas para el flujo de órdenes
    Route::get('orders/search', fn() => redirect()->route('dashboard'))->name('orders.search.get');
    Route::post('orders/search', [OrderController::class, 'search'])->name('orders.search');

    // Rutas GET para páginas de órdenes (redirigen al dashboard si se refrescan)
    Route::get('orders/follow-up', function () {
        return redirect()->route('dashboard');
    })->name('orders.follow-up.get');
    Route::get('orders/new-order', function () {
        return redirect()->route('dashboard');
    })->name('orders.new-order.get');

    // Rutas POST para acciones de órdenes
    Route::post('orders', [OrderController::class, 'store'])->name('orders.store');
    Route::post('orders/{order}/pay', [OrderController::class, 'payOnly'])->name('orders.pay');
    Route::post('orders/{order}/deliver', [OrderController::class, 'deliverOnly'])->name('orders.deliver');
    Route::post('orders/{order}/pay-deliver', [OrderController::class, 'payAndDeliver'])->name('orders.pay-deliver');





    require __DIR__ . '/settings.php';
    require __DIR__ . '/users.php';
    require __DIR__ . '/reports.php';
});
