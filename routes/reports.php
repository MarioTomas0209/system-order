<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Reports\ReportController;


Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
Route::get('/reports/orders', [ReportController::class, 'streamOrders'])->name('reports.orders');