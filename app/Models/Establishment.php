<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Establishment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'representative_name',
        'location',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
