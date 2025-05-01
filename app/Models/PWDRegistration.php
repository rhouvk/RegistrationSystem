<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PWDRegistration extends Model
{
    // Specify the actual table name
    protected $table = 'pwd_users';

    protected $fillable = [
        'user_id',
        'pwdNumber',
        'dateApplied',
        'dob',
        'sex',
        'civilStatus',
        'disability_type_id',
        'disability_cause_id',
        'region_id',
        'province_id',
        'municipality_id',
        'barangay_id',
        'house',
        'landline',
        'education',
        'employmentStatus',
        'employmentCategory',
        'employmentType',
        'occupation',
        'occupationOther',
        'organizationAffiliated',
        'organizationContact',
        'organizationAddress',
        'organizationTel',
        'sssNo',
        'gsisNo',
        'pagIbigNo',
        'psnNo',
        'philhealthNo',
        'fatherName',
        'motherName',
        'guardianName',
        'accomplishedBy',
        'certifyingPhysician',
        'encoder',
        'processingOfficer',
        'approvingOfficer',
        'reportingUnit',
        'controlNo',
        'photo',
        'signature',
    ];
    

    protected $casts = [
        'disabilityTypes' => 'array',
        'disabilityCauses'=> 'array',
        'dateApplied'     => 'date',
        'dob'             => 'date',
    ];

    /**
     * Define a one-to-one relationship to the User model.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    
    public function disabilityType() {
        return $this->belongsTo(DisabilityList::class, 'disability_type_id');
    }

    public function disabilityCause()
    {
        return $this->belongsTo(DisabilityList::class, 'disability_cause_id');
    }
    
    public function region()
    {
        return $this->belongsTo(Region::class);
    }
    
    public function province()
    {
        return $this->belongsTo(Province::class);
    }
    
    public function municipality()
    {
        return $this->belongsTo(Municipality::class);
    }
    
    public function barangay()
    {
        return $this->belongsTo(Barangay::class);
    }



}
