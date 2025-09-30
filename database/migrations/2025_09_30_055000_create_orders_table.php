<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_code', 255)->unique(); // número de orden
            $table->date('created_date'); // fecha de elaboración
            $table->date('delivery_date')->nullable(); // fecha de entrega
            $table->string('concept', 255); // concepto
            $table->decimal('total', 10, 2); // total
            $table->decimal('advance', 10, 2)->default(0); // anticipo
            $table->decimal('balance', 10, 2); // saldo
            $table->enum('status', ['en_elaboracion', 'entregada', 'cancelada'])->default('en_elaboracion');
            
            // Campos adicionales recomendados
            $table->text('notes')->nullable(); // observaciones
            $table->string('delivery_address', 500)->nullable(); // dirección de entrega
            $table->string('contact_phone', 20)->nullable(); // teléfono de contacto
            
            // Relaciones
            $table->foreignId('branch_id')->constrained('branches')->onDelete('restrict');
            $table->foreignId('created_by')->constrained('users')->onDelete('restrict');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDelete('set null');
            
            $table->timestamps();
            
            // Índices para optimizar búsquedas
            $table->index(['order_code']);
            $table->index(['status']);
            $table->index(['branch_id']);
            $table->index(['created_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
