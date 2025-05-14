<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\BnpcItem;
use App\Models\PWDRegistration;
use App\Models\User;

class BnpcPurchase extends Model
{
protected $fillable = [
    'date_of_purchase',
    'bnpc_item_id',
    'quantity',
    'total_amount',
    'discounted_price',   // ✅ REQUIRED!
    'remaining_balance',
    'bought_by',
    'store_id',
    'signature_path',
];

    public function item()
    {
        return $this->belongsTo(BnpcItem::class, 'bnpc_item_id');
    }

    public function buyer()
    {
        return $this->belongsTo(PWDRegistration::class, 'bought_by', 'user_id');
    }

    public function store()
    {
        return $this->belongsTo(User::class, 'store_id');
    }
}
