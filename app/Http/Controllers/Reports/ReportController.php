<?php

namespace App\Http\Controllers\Reports;

use Inertia\Inertia;
use Inertia\Response;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Http\Request;

use App\Http\Controllers\Controller;
use App\Services\Reports\ReportService;
use App\Models\Order;

class ReportController extends Controller
{

    public function __construct(private ReportService $reportService) {}

    public function index(): Response
    {
        $data = [
            'orders' => $this->reportService->getOrdersData(),
            'payments' => $this->reportService->getPaymentsData(),
            'deliveries' => $this->reportService->getDeliveriesData(),
            'users' => $this->reportService->getUsersData(),
            'branches' => $this->reportService->getBranchesData(),
        ];

        return Inertia::render('reports/Index', $data);
    }

    public function streamOrders(Request $request): HttpResponse
    {
        $status = $request->input('status');
        $branchId = $request->input('branch_id');
        $search = $request->input('search');

        $orders = Order::with(['branch', 'payments', 'deliveries', 'creator', 'updater'])
            ->orderBy('created_at', 'desc')
            ->when($status, fn($query) => $query->where('status', $status))
            ->when($branchId, fn($query) => $query->where('branch_id', $branchId))
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('order_code', 'like', "%{$search}%")
                        ->orWhere('concept', 'like', "%{$search}%")
                        ->orWhere('contact_phone', 'like', "%{$search}%");
                });
            })
            ->get();

        $orders->transform(function ($order) {
            $order->total_paid = $order->payments()->sum('amount');
            $order->remaining_balance = $order->total - $order->total_paid;
            $order->is_delivered = $order->deliveries()->where('status', 'entregado')->exists();
            return $order;
        });

        $data = [
            'orders' => $orders,
            'filters' => $request->only(['status', 'branch_id', 'search']),
            'statusOptions' => [
                'en_elaboracion' => 'En Elaboración',
                'entregada' => 'Entregada',
                'cancelada' => 'Cancelada',
            ]
        ];

        $pdf = PDF::loadView('exports.reports.orders', $data);

        $filename = "reporte-ordenes-" . now()->format('Y-m-d') . ".pdf";

        return $pdf->stream($filename);
    }
}
