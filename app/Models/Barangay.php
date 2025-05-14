<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Barangay extends Model
{
    use HasFactory;
    protected $table = 'barangays';
    protected $fillable = [
        'name',
        'municipality_id',
        'admin_district',
    ];

    public function municipality()
    {
        return $this->belongsTo(Municipality::class);
    }

public function pwdRegistrations()
{
    return $this->hasMany(PWDRegistration::class);
}

}
