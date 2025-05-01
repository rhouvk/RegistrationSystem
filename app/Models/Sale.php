<?php
// app/Models/Sale.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    protected $table = 'sales_log';        // or whatever your table is actually called
    protected $fillable = [
        'date_of_sale',
        'purchased_by',
        'total_amount',
        'item_name',
        'quantity',
        'signature_path',
        'store_id',
    ];
}
