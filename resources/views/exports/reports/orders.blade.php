@php
    use Carbon\Carbon;
@endphp

@extends('exports.layouts.PDFLayout')
@section('title', 'Reporte de Órdenes')

@section('content')

    <h3>Reporte de Órdenes</h3>
    <p class="fecha">Fecha de consulta: {{ now()->format('d-m-Y H:i') }}</p>

    @if (isset($filters) && count(array_filter($filters)))
        <div style="margin-bottom: 15px; padding: 10px; background-color: #f8f9fa; border-left: 4px solid #007bff;">
            <strong>Filtros aplicados:</strong>
            @if (isset($filters['status']))
                <span style="margin-left: 10px;">Estado: <strong>{{ $statusOptions[$filters['status']] ?? $filters['status'] }}</strong></span>
            @endif
            @if (isset($filters['branch_id']))
                <span style="margin-left: 10px;">Sucursal ID: <strong>{{ $filters['branch_id'] }}</strong></span>
            @endif
            @if (isset($filters['search']))
                <span style="margin-left: 10px;">Búsqueda: <strong>{{ $filters['search'] }}</strong></span>
            @endif
        </div>
    @endif

    @if ($orders->isEmpty())
        <div class="no-data">
            <p><strong>No se encontraron órdenes con los filtros aplicados.</strong></p>
        </div>
    @else
        <table class="table" style="font-size: 0.65em;">
            <thead>
                <tr>
                    <th class="th" style="width: 8%;">Código</th>
                    <th class="th" style="width: 12%;">Concepto</th>
                    <th class="th" style="width: 8%;">Sucursal</th>
                    <th class="th" style="width: 15%;">Estado</th>
                    <th class="th" style="width: 7%;">Total</th>
                    <th class="th" style="width: 7%;">Pagado</th>
                    <th class="th" style="width: 7%;">Saldo</th>
                    <th class="th" style="width: 8%;">F. Elaboración</th>
                    <th class="th" style="width: 8%;">F. Entrega</th>
                    <th class="th" style="width: 8%;">Creado por</th>
                    <th class="th" style="width: 8%;">Modificado por</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($orders as $order)
                    <tr style="border-bottom: 1px solid #ddd;">
                        <td style="padding: 8px 5px;">
                            <strong>{{ $order->order_code }}</strong>
                        </td>
                        <td style="padding: 8px 5px;">
                            <div style="max-width: 150px; overflow: hidden; text-overflow: ellipsis;">
                                {{ $order->concept }}
                            </div>
                        </td>
                        <td style="padding: 8px 5px;">
                            {{ $order->branch?->name ?? 'N/A' }}
                        </td>
                        <td style="padding: 18px 5px;">
                            @if ($order->status === 'en_elaboracion')
                                <span style="background-color: #cfe2ff; color: #084298; padding: 4px 8px; border-radius: 15px; font-size: 0.85em; font-weight: bold;">
                                    En Elaboración
                                </span>
                            @elseif($order->status === 'entregada')
                                <span style="background-color: #d1e7dd; color: #0f5132; padding: 4px 8px; border-radius: 15px; font-size: 0.85em; font-weight: bold;">
                                    Entregada
                                </span>
                            @elseif($order->status === 'cancelada')
                                <span style="background-color: #f8d7da; color: #842029; padding: 4px 8px; border-radius: 15px; font-size: 0.85em; font-weight: bold;">
                                    Cancelada
                                </span>
                            @else
                                <span style="background-color: #e9ecef; color: #495057; padding: 4px 8px; border-radius: 15px; font-size: 0.85em; font-weight: bold;">
                                    {{ $statusOptions[$order->status] ?? $order->status }}
                                </span>
                            @endif
                        </td>
                        <td style="padding: 8px 5px; font-weight: bold;">
                            ${{ number_format($order->total, 2) }}
                        </td>
                        <td style="padding: 8px 5px; color: #198754; font-weight: bold;">
                            ${{ number_format($order->total_paid ?? 0, 2) }}
                        </td>
                        <td style="padding: 8px 5px; font-weight: bold; color: {{ ($order->remaining_balance ?? 0) > 0 ? '#fd7e14' : '#198754' }};">
                            ${{ number_format($order->remaining_balance ?? 0, 2) }}
                        </td>
                        <td style="padding: 8px 5px;">
                            {{ $order->created_date ? Carbon::parse($order->created_date)->format('d/m/Y') : 'N/A' }}
                        </td>
                        <td style="padding: 8px 5px;">
                            {{ $order->delivery_date ? Carbon::parse($order->delivery_date)->format('d/m/Y') : 'Sin fecha' }}
                        </td>
                        <td style="padding: 8px 5px; font-size: 0.9em;">
                            <strong>{{ $order->creator?->name ?? 'N/A' }}</strong>
                        </td>
                        <td style="padding: 8px 5px; font-size: 0.9em;">
                            <strong>{{ $order->updater?->name ?? 'Sin modificaciones' }}</strong>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
            <strong>Resumen:</strong>
            <div style="margin-top: 10px;">
                <span style="margin-right: 20px;">Total de órdenes: <strong>{{ $orders->count() }}</strong></span>
                <span style="margin-right: 20px;">Suma Total: <strong>${{ number_format($orders->sum('total'), 2) }}</strong></span>
                <span style="margin-right: 20px;">Total Pagado: <strong style="color: #198754;">${{ number_format($orders->sum('total_paid'), 2) }}</strong></span>
                <span>Saldo Pendiente: <strong style="color: #fd7e14;">${{ number_format($orders->sum('remaining_balance'), 2) }}</strong></span>
            </div>
        </div>
    @endif

@endsection