<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Delivery;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class OrderController extends Controller
{
    /**
     * Listar todas las órdenes
     */
    public function index(Request $request): Response
    {
        $query = Order::with(['branch', 'payments', 'deliveries', 'creator', 'updater'])
            ->orderBy('created_at', 'desc');

        // Filtros opcionales
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('branch_id')) {
            $query->where('branch_id', $request->branch_id);
        }

        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('order_code', 'like', "%{$searchTerm}%")
                  ->orWhere('concept', 'like', "%{$searchTerm}%")
                  ->orWhere('contact_phone', 'like', "%{$searchTerm}%");
            });
        }

        $orders = $query->paginate(15)->withQueryString();

        // Agregar datos calculados a cada orden
        $orders->getCollection()->transform(function ($order) {
            $order->total_paid = $order->payments()->sum('amount');
            $order->remaining_balance = $order->total - $order->total_paid;
            $order->is_delivered = $order->deliveries()->where('status', 'entregado')->exists();
            return $order;
        });

        return Inertia::render('orders/Index', [
            'orders' => $orders,
            'branches' => Branch::where('is_active', true)->get(),
            'filters' => $request->only(['status', 'branch_id', 'search']),
            'statusOptions' => [
                'en_elaboracion' => 'En Elaboración',
                'entregada' => 'Entregada',
                'cancelada' => 'Cancelada',
            ],
        ]);
    }

    /**
     * Buscar orden por código
     */
    public function search(Request $request): Response
    {
        $request->validate([
            'order_code' => 'required|string|max:50',
        ]);

        $orderCode = strtoupper(trim($request->order_code));
        
        // Buscar la orden
        $order = Order::with(['branch', 'payments', 'deliveries', 'creator', 'updater'])
            ->where('order_code', $orderCode)
            ->first();

        if ($order) {
            // Orden encontrada - mostrar seguimiento
            return Inertia::render('orders/FollowUp', [
                'order' => $order,
                'totalPaid' => $order->total_paid,
                'remainingBalance' => $order->remaining_balance,
            ]);
        } else {
            // Orden no encontrada - mostrar formulario de nueva orden
            return Inertia::render('orders/NewOrder', [
                'orderCode' => $orderCode,
                'branches' => Branch::where('is_active', true)->get(),
            ]);
        }
    }

    /**
     * Crear nueva orden
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'order_code' => 'required|string|max:50|unique:orders,order_code',
            'elaboration_date' => 'required|date',
            'delivery_date' => 'nullable|date',
            'branch_id' => 'required|exists:branches,id',
            'concept' => 'required|string|max:255',
            'total' => 'required|numeric|min:0.01',
            'advance' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
            'delivery_address' => 'nullable|string|max:500',
            'contact_phone' => 'nullable|string|max:20',
        ]);

        // Calcular el saldo
        $balance = $validated['total'] - $validated['advance'];

        DB::transaction(function () use ($validated, $balance) {
            $order = Order::create([
                'order_code' => strtoupper($validated['order_code']),
                'created_date' => $validated['elaboration_date'],
                'delivery_date' => $validated['delivery_date'],
                'concept' => $validated['concept'],
                'total' => $validated['total'],
                'advance' => $validated['advance'],
                'balance' => $balance,
                'status' => 'en_elaboracion',
                'notes' => $validated['notes'],
                'delivery_address' => $validated['delivery_address'],
                'contact_phone' => $validated['contact_phone'],
                'branch_id' => $validated['branch_id'],
                'created_by' => Auth::id(),
            ]);

            // Si hay anticipo, registrar el pago
            if ($validated['advance'] > 0) {
                Payment::create([
                    'order_id' => $order->id,
                    'payment_date' => $validated['elaboration_date'],
                    'amount' => $validated['advance'],
                    'method' => 'efectivo',
                    'received_by' => Auth::id(),
                    'notes' => 'Anticipo inicial',
                ]);
            }
        });

        return redirect()->route('dashboard')
            ->with('success', "Orden {$validated['order_code']} creada exitosamente.");
    }

    /**
     * Registrar pago
     */
    public function addPayment(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'payment_date' => 'required|date',
            'amount' => 'required|numeric|min:0.01',
            'method' => ['required', Rule::in(['efectivo', 'tarjeta', 'transferencia'])],
            'notes' => 'nullable|string',
        ]);

        DB::transaction(function () use ($validated) {
            // Crear el pago
            Payment::create([
                'order_id' => $validated['order_id'],
                'payment_date' => $validated['payment_date'],
                'amount' => $validated['amount'],
                'method' => $validated['method'],
                'received_by' => Auth::id(),
                'notes' => $validated['notes'],
            ]);

            // Actualizar el estado de la orden
            $order = Order::find($validated['order_id']);
            $totalPaid = $order->payments()->sum('amount');
            
            if ($totalPaid >= $order->total) {
                $order->update([
                    'status' => 'entregada',
                    'updated_by' => Auth::id(),
                ]);
            } else {
                $order->update([
                    'status' => 'en_elaboracion',
                    'updated_by' => Auth::id(),
                ]);
            }
        });

        return redirect()->back()
            ->with('success', 'Pago registrado exitosamente.');
    }

    /**
     * Registrar entrega
     */
    public function addDelivery(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'delivery_date' => 'required|date',
            'status' => ['required', Rule::in(['entregado', 'parcial'])],
            'comments' => 'nullable|string',
            'tracking_number' => 'nullable|string|max:100',
            'delivery_method' => 'nullable|string|max:50',
        ]);

        DB::transaction(function () use ($validated) {
            // Crear la entrega
            Delivery::create([
                'order_id' => $validated['order_id'],
                'delivery_date' => $validated['delivery_date'],
                'status' => $validated['status'],
                'comments' => $validated['comments'],
                'delivered_by' => Auth::id(),
                'tracking_number' => $validated['tracking_number'],
                'delivery_method' => $validated['delivery_method'],
            ]);

            // Actualizar el estado de la orden
            $order = Order::find($validated['order_id']);
            if ($validated['status'] === 'entregado') {
                $order->update([
                    'status' => 'entregada',
                    'updated_by' => Auth::id(),
                ]);
            }
        });

        return redirect()->back()
            ->with('success', 'Entrega registrada exitosamente.');
    }

    /**
     * Acción combinada: Pagar y Entregar
     */
    public function payAndDeliver(Request $request, Order $order): Response
    {
        $validated = $request->validate([
            'payment_date' => 'required|date',
            'amount' => 'required|numeric|min:0.01',
            'method' => ['required', Rule::in(['efectivo', 'tarjeta', 'transferencia'])],
            'delivery_date' => 'required|date',
            'delivery_comments' => 'nullable|string',
        ]);

        DB::transaction(function () use ($validated, $order) {
            // Registrar el pago
            Payment::create([
                'order_id' => $order->id,
                'payment_date' => $validated['payment_date'],
                'amount' => $validated['amount'],
                'method' => $validated['method'],
                'received_by' => Auth::id(),
                'notes' => 'Pago y entrega',
            ]);

            // Registrar la entrega
            Delivery::create([
                'order_id' => $order->id,
                'delivery_date' => $validated['delivery_date'],
                'status' => 'entregado',
                'comments' => $validated['delivery_comments'],
                'delivered_by' => Auth::id(),
            ]);

            // Actualizar el estado de la orden
            $order->update([
                'status' => 'entregada',
                'delivery_date' => $validated['delivery_date'],
                'updated_by' => Auth::id(),
            ]);
        });

        // Recargar la orden con relaciones actualizadas
        $order->load(['branch', 'payments', 'deliveries']);
        
        return Inertia::render('orders/FollowUp', [
            'order' => $order,
            'totalPaid' => $order->payments()->sum('amount'),
            'remainingBalance' => $order->total - $order->payments()->sum('amount'),
        ])->with('success', 'Pago y entrega registrados exitosamente.');
    }

    /**
     * Solo pagar
     */
    public function payOnly(Request $request, Order $order): Response
    {
        $validated = $request->validate([
            'payment_date' => 'required|date',
            'amount' => 'required|numeric|min:0.01',
            'method' => ['required', Rule::in(['efectivo', 'tarjeta', 'transferencia'])],
            'notes' => 'nullable|string',
        ]);

        DB::transaction(function () use ($validated, $order) {
            // Crear el pago
            Payment::create([
                'order_id' => $order->id,
                'payment_date' => $validated['payment_date'],
                'amount' => $validated['amount'],
                'method' => $validated['method'],
                'received_by' => Auth::id(),
                'notes' => $validated['notes'],
            ]);

            // Actualizar el estado de la orden
            $totalPaid = $order->payments()->sum('amount');
            
            if ($totalPaid >= $order->total) {
                $order->update([
                    'status' => 'entregada',
                    'updated_by' => Auth::id(),
                ]);
            } else {
                $order->update([
                    'status' => 'en_elaboracion',
                    'updated_by' => Auth::id(),
                ]);
            }
        });

        // Recargar la orden con relaciones actualizadas
        $order->load(['branch', 'payments', 'deliveries']);
        
        return Inertia::render('orders/FollowUp', [
            'order' => $order,
            'totalPaid' => $order->payments()->sum('amount'),
            'remainingBalance' => $order->total - $order->payments()->sum('amount'),
        ])->with('success', 'Pago registrado exitosamente.');
    }

    /**
     * Solo entregar
     */
    public function deliverOnly(Request $request, Order $order): Response
    {
        $validated = $request->validate([
            'delivery_date' => 'required|date',
            'status' => ['required', Rule::in(['pendiente', 'entregado', 'parcial'])],
            'comments' => 'nullable|string',
            'tracking_number' => 'nullable|string',
            'delivery_method' => ['nullable', Rule::in(['entrega_directa', 'envio', 'recoger'])],
        ]);

        DB::transaction(function () use ($validated, $order) {
            // Crear la entrega
            Delivery::create([
                'order_id' => $order->id,
                'delivery_date' => $validated['delivery_date'],
                'status' => $validated['status'],
                'comments' => $validated['comments'],
                'tracking_number' => $validated['tracking_number'],
                'delivery_method' => $validated['delivery_method'],
                'delivered_by' => Auth::id(),
            ]);

            // Actualizar el estado de la orden
            $order->update([
                'status' => 'entregada',
                'delivery_date' => $validated['delivery_date'],
                'updated_by' => Auth::id(),
            ]);
        });

        // Recargar la orden con relaciones actualizadas
        $order->load(['branch', 'payments', 'deliveries']);
        
        return Inertia::render('orders/FollowUp', [
            'order' => $order,
            'totalPaid' => $order->payments()->sum('amount'),
            'remainingBalance' => $order->total - $order->payments()->sum('amount'),
        ])->with('success', 'Entrega registrada exitosamente.');
    }

    /**
     * Mostrar formulario de edición
     */
    public function edit(Order $order): Response
    {
        $order->load(['branch', 'payments', 'deliveries', 'creator', 'updater']);
        
        return Inertia::render('orders/Edit', [
            'order' => $order,
            'branches' => Branch::where('is_active', true)->get(),
        ]);
    }

    /**
     * Actualizar orden
     */
    public function update(Request $request, Order $order): RedirectResponse
    {
        $validated = $request->validate([
            'order_code' => ['required', 'string', 'max:50', Rule::unique('orders')->ignore($order->id)],
            'elaboration_date' => 'required|date',
            'delivery_date' => 'nullable|date',
            'concept' => 'required|string|max:255',
            'total' => 'required|numeric|min:0',
            'advance' => 'required|numeric|min:0',
            'status' => ['required', Rule::in(['en_elaboracion', 'entregada', 'cancelada'])],
            'notes' => 'nullable|string',
            'delivery_address' => 'nullable|string|max:255',
            'contact_phone' => 'nullable|string|max:20',
            'branch_id' => 'required|exists:branches,id',
        ]);

        DB::transaction(function () use ($validated, $order) {
            $balance = $validated['total'] - $validated['advance'];
            
            $order->update([
                'order_code' => strtoupper(trim($validated['order_code'])),
                'created_date' => $validated['elaboration_date'],
                'delivery_date' => $validated['delivery_date'],
                'concept' => $validated['concept'],
                'total' => $validated['total'],
                'advance' => $validated['advance'],
                'balance' => $balance,
                'status' => $validated['status'],
                'notes' => $validated['notes'],
                'delivery_address' => $validated['delivery_address'],
                'contact_phone' => $validated['contact_phone'],
                'branch_id' => $validated['branch_id'],
                'updated_by' => Auth::id(),
            ]);
        });

        return redirect()->route('orders.index')
            ->with('success', "Orden {$validated['order_code']} actualizada exitosamente.");
    }
}
