<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_code',
        'created_date',
        'delivery_date',
        'concept',
        'total',
        'advance',
        'balance',
        'status',
        'notes',
        'delivery_address',
        'contact_phone',
        'branch_id',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'created_date' => 'date:Y-m-d',
        'delivery_date' => 'date:Y-m-d',
        'total' => 'decimal:2',
        'advance' => 'decimal:2',
        'balance' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relaciones
    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function deliveries(): HasMany
    {
        return $this->hasMany(Delivery::class);
    }

    // Métodos de utilidad
    public function getTotalPaidAttribute(): float
    {
        return $this->payments()->sum('amount');
    }

    public function getRemainingBalanceAttribute(): float
    {
        return $this->total - $this->total_paid;
    }

    public function isFullyPaid(): bool
    {
        return $this->remaining_balance <= 0;
    }

    public function isDelivered(): bool
    {
        return $this->deliveries()->where('status', 'entregado')->exists();
    }

    public function getStatusBadgeColorAttribute(): string
    {
        return match($this->status) {
            'en_elaboracion' => 'bg-blue-100 text-blue-800',
            'entregada' => 'bg-emerald-100 text-emerald-800',
            'cancelada' => 'bg-red-100 text-red-800',
            default => 'bg-gray-100 text-gray-800',
        };
    }

    public function getStatusLabelAttribute(): string
    {
        return match($this->status) {
            'en_elaboracion' => 'En Elaboración',
            'entregada' => 'Entregada',
            'cancelada' => 'Cancelada',
            default => 'Desconocido',
        };
    }
}
