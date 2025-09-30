<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Primero actualizar los datos existentes
        DB::table('orders')->whereIn('status', ['pendiente', 'pagada_parcial', 'pagada'])
                          ->update(['status' => 'en_elaboracion']);
        
        // Luego cambiar el enum
        Schema::table('orders', function (Blueprint $table) {
            $table->enum('status', ['en_elaboracion', 'entregada', 'cancelada'])
                  ->default('en_elaboracion')
                  ->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->enum('status', ['pendiente', 'pagada_parcial', 'pagada', 'entregada', 'cancelada'])
                  ->default('pendiente')
                  ->change();
        });
        
        // Revertir los datos
        DB::table('orders')->where('status', 'en_elaboracion')
                          ->update(['status' => 'pendiente']);
    }
};
