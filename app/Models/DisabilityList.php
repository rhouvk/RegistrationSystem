<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DisabilityList extends Model
{
    use HasFactory;
    protected $table = 'disability_lists';
    protected $fillable = [
        'name',
        'category',
    ];
}
