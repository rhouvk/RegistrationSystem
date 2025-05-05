<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedicinePurchase extends Model
{
    use HasFactory;

    protected $fillable = [
        'buyer_id',
        'medicine_purchase',
        'quantity_prescribed',
        'filling_status',
        'filling_amount',
        'date',
        'physician_name',
        'physician_address',
        'physician_ptr_no',
        'drugstore_id',
        'pharmacist_name',
    ];

    protected $casts = [
        'date' => 'date',
        'filling_status' => 'integer',
        'quantity_prescribed' => 'integer',
        'filling_amount' => 'integer',
    ];

    /**
     * These appended attributes will be included in JSON responses
     */
    protected $appends = ['filling_status_label'];

    /**
     * Accessor for filing_status_label
     */
    public function getFillingStatusLabelAttribute(): string
    {
        return match ($this->filling_status) {
            1 => 'First Filing',
            2 => 'Second Filing',
            3 => 'Fully Filed',
            default => 'Unknown',
        };
    }

    /**
     * Relationship: buyer (PWD user)
     */
    public function buyer()
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    /**
     * Relationship: drugstore (serving pharmacy)
     */
    public function drugstore()
    {
        return $this->belongsTo(User::class, 'drugstore_id');
    }
}
