<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Prescription extends Model
{
    use HasFactory;

    protected $fillable = [
        'buyer_id',
        'medicine_purchase',
        'quantity_prescribed',
        'date',
        'physician_name',
        'physician_address',
        'physician_ptr_no',
        'created_by',
    ];
    protected $casts = [
        'date' => 'date', // ✅ ensures it's treated as Carbon
    ];

    // Relationships

    public function buyer()
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    public function encoder()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function fillings()
    {
        return $this->hasMany(PrescriptionFilling::class);
    }
}
