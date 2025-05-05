<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PrescriptionFilling extends Model
{
    use HasFactory;

    protected $fillable = [
        'prescription_id',
        'drugstore_id',
        'pharmacist_name',
        'filling_status',
        'filling_amount',
    ];

    // Relationships

    public function prescription()
    {
        return $this->belongsTo(Prescription::class);
    }

    public function drugstore()
    {
        return $this->belongsTo(User::class, 'drugstore_id');
    }
}
