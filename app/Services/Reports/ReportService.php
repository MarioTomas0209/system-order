<?php

namespace App\Services\Reports;

use Illuminate\Support\Facades\DB;

use App\Models\Order;
use App\Models\Payment;
use App\Models\Delivery;
use App\Models\User;
use App\Models\Branch;


class ReportService
{
    public function getOrdersData(): array
    {
        // Estados de órdenes
        $ordersByStatus = Order::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => match ($item->status) {
                        'en_elaboracion' => 'En Elaboración',
                        'entregada' => 'Entregada',
                        'cancelada' => 'Cancelada',
                        default => 'Desconocido',
                    },
                    'value' => $item->count,
                ];
            });

        // Órdenes por mes
        $ordersByMonth = Order::select(
            DB::raw('DATE_FORMAT(created_date, "%Y-%m") as month'),
            DB::raw('count(*) as count')
        )
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => $item->month,
                    'count' => $item->count,
                ];
            });

        // Ventas por mes
        $salesByMonth = Order::select(
            DB::raw('DATE_FORMAT(created_date, "%Y-%m") as month'),
            DB::raw('SUM(total) as total'),
            DB::raw('SUM(advance) as advance'),
            DB::raw('SUM(balance) as balance')
        )
            ->where('status', '!=', 'cancelada')
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => $item->month,
                    'total' => (float) $item->total,
                    'advance' => (float) $item->advance,
                    'balance' => (float) $item->balance,
                ];
            });

        // Órdenes por sucursal
        $ordersByBranch = Order::select('branches.name', DB::raw('count(orders.id) as count'))
            ->join('branches', 'orders.branch_id', '=', 'branches.id')
            ->groupBy('branches.name', 'branches.id')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->name,
                    'count' => $item->count,
                ];
            });

        return [
            'byStatus' => $ordersByStatus,
            'byMonth' => $ordersByMonth,
            'salesByMonth' => $salesByMonth,
            'byBranch' => $ordersByBranch,
        ];
    }

    public function getPaymentsData(): array
    {
        // Pagos por método
        $paymentsByMethod = Payment::select('method', DB::raw('count(*) as count'))
            ->groupBy('method')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => match ($item->method) {
                        'efectivo' => 'Efectivo',
                        'tarjeta' => 'Tarjeta',
                        'transferencia' => 'Transferencia',
                        default => 'Desconocido',
                    },
                    'value' => $item->count,
                ];
            });

        // Total por método de pago
        $totalByMethod = Payment::select('method', DB::raw('SUM(amount) as total'))
            ->groupBy('method')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => match ($item->method) {
                        'efectivo' => 'Efectivo',
                        'tarjeta' => 'Tarjeta',
                        'transferencia' => 'Transferencia',
                        default => 'Desconocido',
                    },
                    'total' => (float) $item->total,
                ];
            });

        // Pagos por mes
        $paymentsByMonth = Payment::select(
            DB::raw('DATE_FORMAT(payment_date, "%Y-%m") as month'),
            DB::raw('count(*) as count'),
            DB::raw('SUM(amount) as total')
        )
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => $item->month,
                    'count' => $item->count,
                    'total' => (float) $item->total,
                ];
            });

        return [
            'byMethod' => $paymentsByMethod,
            'totalByMethod' => $totalByMethod,
            'byMonth' => $paymentsByMonth,
        ];
    }

    public function getDeliveriesData(): array
    {
        // Entregas por estado
        $deliveriesByStatus = Delivery::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => match ($item->status) {
                        'pendiente' => 'Pendiente',
                        'entregado' => 'Entregado',
                        'parcial' => 'Parcial',
                        default => 'Desconocido',
                    },
                    'value' => $item->count,
                ];
            });

        // Entregas por mes
        $deliveriesByMonth = Delivery::select(
            DB::raw('DATE_FORMAT(delivery_date, "%Y-%m") as month'),
            DB::raw('count(*) as count')
        )
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => $item->month,
                    'count' => $item->count,
                ];
            });

        // Entregas por método
        $deliveriesByMethod = Delivery::select('delivery_method', DB::raw('count(*) as count'))
            ->whereNotNull('delivery_method')
            ->groupBy('delivery_method')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => match ($item->delivery_method) {
                        'recoleccion' => 'Recolección',
                        'envio' => 'Envío',
                        'entrega_directa' => 'Entrega Directa',
                        default => $item->delivery_method ?? 'No especificado',
                    },
                    'value' => $item->count,
                ];
            });

        return [
            'byStatus' => $deliveriesByStatus,
            'byMonth' => $deliveriesByMonth,
            'byMethod' => $deliveriesByMethod,
        ];
    }

    public function getUsersData(): array
    {
        // Usuarios activos vs inactivos (solo visibles)
        $usersByStatus = User::select('is_active', DB::raw('count(*) as count'))
            ->where('may_be_visible', true)
            ->groupBy('is_active')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->is_active ? 'Activos' : 'Inactivos',
                    'value' => $item->count,
                ];
            });

        // Usuarios por rol (solo visibles)
        $usersByRole = User::select('is_super_admin', DB::raw('count(*) as count'))
            ->where('may_be_visible', true)
            ->groupBy('is_super_admin')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->is_super_admin ? 'Administradores' : 'Usuarios',
                    'value' => $item->count,
                ];
            });

        // Órdenes creadas por usuario (top 10, solo usuarios visibles)
        $ordersByUser = Order::select('users.name', DB::raw('count(orders.id) as count'))
            ->join('users', 'orders.created_by', '=', 'users.id')
            ->where('users.may_be_visible', true)
            ->groupBy('users.name', 'users.id')
            ->orderBy('count', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->name,
                    'count' => $item->count,
                ];
            });

        return [
            'byStatus' => $usersByStatus,
            'byRole' => $usersByRole,
            'ordersByUser' => $ordersByUser,
        ];
    }

    public function getBranchesData(): array
    {
        // Sucursales activas vs inactivas
        $branchesByStatus = Branch::select('is_active', DB::raw('count(*) as count'))
            ->groupBy('is_active')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->is_active ? 'Activas' : 'Inactivas',
                    'value' => $item->count,
                ];
            });

        // Órdenes por sucursal
        $ordersByBranch = Order::select('branches.name', DB::raw('count(orders.id) as count'))
            ->join('branches', 'orders.branch_id', '=', 'branches.id')
            ->groupBy('branches.name', 'branches.id')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->name,
                    'count' => $item->count,
                ];
            });

        // Ingresos por sucursal
        $revenueByBranch = Order::select('branches.name', DB::raw('SUM(orders.total) as total'))
            ->join('branches', 'orders.branch_id', '=', 'branches.id')
            ->where('orders.status', '!=', 'cancelada')
            ->groupBy('branches.name', 'branches.id')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->name,
                    'total' => (float) $item->total,
                ];
            });

        return [
            'byStatus' => $branchesByStatus,
            'ordersByBranch' => $ordersByBranch,
            'revenueByBranch' => $revenueByBranch,
        ];
    }
}
