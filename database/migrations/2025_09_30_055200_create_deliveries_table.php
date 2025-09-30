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
        Schema::create('deliveries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->date('delivery_date');
            $table->enum('status', ['pendiente', 'entregado', 'parcial'])->default('pendiente');
            $table->text('comments')->nullable();
            $table->foreignId('delivered_by')->constrained('users')->onDelete('restrict');
            
            // Campos adicionales para tracking
            $table->string('tracking_number', 100)->nullable(); // número de seguimiento
            $table->string('delivery_method', 50)->nullable(); // método de entrega (recolección, envío, etc.)
            
            $table->timestamps();
            
            // Índices para optimizar consultas
            $table->index(['order_id']);
            $table->index(['delivery_date']);
            $table->index(['status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deliveries');
    }
};
