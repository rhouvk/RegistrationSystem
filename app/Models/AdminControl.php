<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdminControl extends Model
{
    // Explicitly define the table name if it doesn't follow convention.
    protected $table = 'admin_controls';

    // Allow mass assignment for these columns.
    protected $fillable = ['purchaseLimit', 'cardExpiration', 'BNPCdiscount'];
}
