<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Delivery extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'delivery_date',
        'status',
        'comments',
        'delivered_by',
        'tracking_number',
        'delivery_method',
    ];

    protected $casts = [
        'delivery_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relaciones
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function deliverer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'delivered_by');
    }

    // Métodos de utilidad
    public function getStatusLabelAttribute(): string
    {
        return match($this->status) {
            'pendiente' => 'Pendiente',
            'entregado' => 'Entregado',
            'parcial' => 'Entrega Parcial',
            default => 'Desconocido',
        };
    }

    public function getStatusBadgeColorAttribute(): string
    {
        return match($this->status) {
            'pendiente' => 'bg-yellow-100 text-yellow-800',
            'entregado' => 'bg-green-100 text-green-800',
            'parcial' => 'bg-blue-100 text-blue-800',
            default => 'bg-gray-100 text-gray-800',
        };
    }

    public function getDeliveryMethodLabelAttribute(): string
    {
        return match($this->delivery_method) {
            'recoleccion' => 'Recolección',
            'envio' => 'Envío',
            'entrega_directa' => 'Entrega Directa',
            default => 'No especificado',
        };
    }
}
