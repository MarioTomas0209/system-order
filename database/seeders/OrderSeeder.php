<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\Branch;
use App\Models\User;
use App\Models\Payment;
use App\Models\Delivery;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener la primera sucursal y usuario
        $branch = Branch::first();
        $user = User::first();

        if (!$branch || !$user) {
            $this->command->warn('No hay sucursales o usuarios disponibles. Ejecuta primero BranchSeeder y crea un usuario.');
            return;
        }

        // Crear órdenes de ejemplo
        $orders = [
            [
                'order_code' => 'ORD-001',
                'created_date' => now()->subDays(5)->format('Y-m-d'),
                'concept' => 'Lonas para toldo de 3x4 metros con diseño personalizado',
                'total' => 2500.00,
                'advance' => 500.00,
                'status' => 'en_elaboracion',
                'notes' => 'Cliente solicita entrega urgente',
                'delivery_address' => 'Calle 60 #123, Centro, Mérida, Yucatán',
                'contact_phone' => '9991234567',
            ],
            [
                'order_code' => 'ORD-002',
                'created_date' => now()->subDays(3)->format('Y-m-d'),
                'concept' => 'Set completo de cortinas para oficina (6 piezas)',
                'total' => 1800.00,
                'advance' => 1800.00,
                'status' => 'entregada',
                'notes' => 'Pago completo al momento de la orden',
                'delivery_address' => 'Av. Paseo de Montejo #456, Mérida, Yucatán',
                'contact_phone' => '9997654321',
            ],
            [
                'order_code' => 'ORD-003',
                'created_date' => now()->subDays(1)->format('Y-m-d'),
                'concept' => 'Mantel para restaurante 2x3 metros',
                'total' => 1200.00,
                'advance' => 0.00,
                'status' => 'en_elaboracion',
                'notes' => 'Cliente pagará al momento de la entrega',
                'delivery_address' => 'Calle 25 #789, Centro, Mérida, Yucatán',
                'contact_phone' => '9999876543',
            ],
        ];

        foreach ($orders as $orderData) {
            $order = Order::create([
                ...$orderData,
                'balance' => $orderData['total'] - $orderData['advance'],
                'branch_id' => $branch->id,
                'created_by' => $user->id,
            ]);

            // Si hay anticipo, crear el pago correspondiente
            if ($orderData['advance'] > 0) {
                Payment::create([
                    'order_id' => $order->id,
                    'payment_date' => $orderData['created_date'],
                    'amount' => $orderData['advance'],
                    'method' => 'efectivo',
                    'received_by' => $user->id,
                    'notes' => 'Anticipo inicial',
                ]);
            }

            // Si la orden está entregada, crear una entrega
            if ($orderData['status'] === 'entregada') {
                Delivery::create([
                    'order_id' => $order->id,
                    'delivery_date' => now()->subDays(1)->format('Y-m-d'),
                    'status' => 'entregado',
                    'comments' => 'Entrega completada exitosamente',
                    'delivered_by' => $user->id,
                    'delivery_method' => 'entrega_directa',
                ]);
            }
        }

        $this->command->info('Órdenes de ejemplo creadas exitosamente.');
    }
}
