<?php

// File: app/Models/Subscription.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'payment_id',
        'amount',
        'duration',
        'starts_at',
        'ends_at',
        'refunded',
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'refunded' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
