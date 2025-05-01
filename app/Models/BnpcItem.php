<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BnpcItem extends Model
{
    // if your table is not the plural of this class, uncomment:
    // protected $table = 'bnpc_items';

    protected $fillable = [
        'name',
        'type',
    ];

    
}

