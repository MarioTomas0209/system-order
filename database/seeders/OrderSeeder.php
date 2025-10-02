<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\Branch;
use App\Models\User;
use App\Models\Payment;
use App\Models\Delivery;
use Carbon\Carbon;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $branches = Branch::all();
        $users = User::all();

        if ($branches->isEmpty() || $users->isEmpty()) {
            $this->command->warn('No hay sucursales o usuarios disponibles. Ejecuta primero BranchSeeder y UserSeeder.');
            return;
        }

        $statuses = ['en_elaboracion', 'entregada', 'cancelada'];
        $paymentMethods = ['efectivo', 'tarjeta', 'transferencia'];
        $deliveryMethods = ['recoleccion', 'envio', 'entrega_directa'];
        
        $concepts = [
            'Lonas para toldo de 3x4 metros',
            'Set completo de cortinas para oficina',
            'Mantel para restaurante',
            'Banner publicitario 2x1 metros',
            'Lona para evento corporativo',
            'Cortinas blackout para sala',
            'Toldos para terraza',
            'Carpas para evento',
            'Banners roll-up',
            'Impresión de vinil adhesivo',
        ];

        // Generar órdenes de los últimos 6 meses
        for ($i = 0; $i < 50; $i++) {
            $createdDate = Carbon::now()->subDays(rand(0, 180));
            $status = $statuses[array_rand($statuses)];
            $total = rand(500, 5000);
            $advance = $status === 'cancelada' ? 0 : rand(0, $total);
            $balance = $total - $advance;

            $order = Order::create([
                'order_code' => 'ORD-' . str_pad($i + 1, 5, '0', STR_PAD_LEFT),
                'created_date' => $createdDate->format('Y-m-d'),
                'delivery_date' => $status === 'entregada' ? $createdDate->addDays(rand(5, 15))->format('Y-m-d') : null,
                'concept' => $concepts[array_rand($concepts)],
                'total' => $total,
                'advance' => $advance,
                'balance' => $balance,
                'status' => $status,
                'notes' => $status === 'cancelada' ? 'Orden cancelada por el cliente' : 'Orden en proceso',
                'delivery_address' => 'Dirección #' . rand(100, 999),
                'contact_phone' => '999' . rand(1000000, 9999999),
                'branch_id' => $branches->random()->id,
                'created_by' => $users->random()->id,
            ]);

            // Crear pagos si hay anticipo
            if ($advance > 0) {
                // Pago inicial (anticipo)
                Payment::create([
                    'order_id' => $order->id,
                    'payment_date' => $createdDate->format('Y-m-d'),
                    'amount' => $advance,
                    'method' => $paymentMethods[array_rand($paymentMethods)],
                    'received_by' => $users->random()->id,
                    'notes' => 'Anticipo inicial',
                ]);

                // Si está entregada y hay balance, agregar pago final
                if ($status === 'entregada' && $balance > 0 && rand(0, 1) === 1) {
                    Payment::create([
                        'order_id' => $order->id,
                        'payment_date' => $createdDate->addDays(rand(3, 10))->format('Y-m-d'),
                        'amount' => $balance,
                        'method' => $paymentMethods[array_rand($paymentMethods)],
                        'received_by' => $users->random()->id,
                        'notes' => 'Pago final',
                    ]);
                }
            }

            // Crear entregas si la orden está entregada
            if ($status === 'entregada') {
                Delivery::create([
                    'order_id' => $order->id,
                    'delivery_date' => $order->delivery_date ?? $createdDate->addDays(rand(5, 15))->format('Y-m-d'),
                    'status' => rand(0, 10) > 1 ? 'entregado' : 'parcial',
                    'comments' => 'Entrega completada exitosamente',
                    'delivered_by' => $users->random()->id,
                    'delivery_method' => $deliveryMethods[array_rand($deliveryMethods)],
                    'tracking_number' => 'TRK-' . rand(10000, 99999),
                ]);
            } elseif ($status === 'en_elaboracion' && rand(0, 3) === 0) {
                // Algunas órdenes en elaboración pueden tener entrega pendiente
                Delivery::create([
                    'order_id' => $order->id,
                    'delivery_date' => $createdDate->addDays(rand(5, 15))->format('Y-m-d'),
                    'status' => 'pendiente',
                    'comments' => 'Entrega programada',
                    'delivered_by' => $users->random()->id,
                    'delivery_method' => $deliveryMethods[array_rand($deliveryMethods)],
                    'tracking_number' => 'TRK-' . rand(10000, 99999),
                ]);
            }
        }

        $this->command->info('Se crearon 50 órdenes con sus respectivos pagos y entregas.');
    }
}
