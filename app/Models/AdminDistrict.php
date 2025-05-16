<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AdminDistrict extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    // 🔁 Relationship: One District has many Barangays
    public function barangays()
    {
        return $this->hasMany(Barangay::class);
    }

    
}
