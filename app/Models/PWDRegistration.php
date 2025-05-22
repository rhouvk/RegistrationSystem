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
        'first_name',
        'middle_name',
        'last_name',
        'suffix',
        'father_first_name',
        'father_middle_name',
        'father_last_name',
        'mother_first_name',
        'mother_middle_name',
        'mother_last_name',
        'guardian_first_name',
        'guardian_middle_name',
        'guardian_last_name',
        'accomplished_by_first_name',
        'accomplished_by_middle_name',
        'accomplished_by_last_name',
        'certifying_physician_first_name',
        'certifying_physician_middle_name',
        'certifying_physician_last_name',
        'physician_license_no',
        'processing_officer_first_name',
        'processing_officer_middle_name',
        'processing_officer_last_name',
        'approving_officer_first_name',
        'approving_officer_middle_name',
        'approving_officer_last_name',
        'encoder_first_name',
        'encoder_middle_name',
        'encoder_last_name',
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
        'accomplishedBy',
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

    protected $appends = ['email', 'mobile'];

    public function getEmailAttribute()
    {
        return $this->user->email;
    }

    public function getMobileAttribute()
    {
        return $this->user->phone;
    }

    /**
     * Define a one-to-one relationship to the User model.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    
    public function disabilityType() {
        return $this->belongsTo(DisabilityList::class, 'disability_type_id')
                    ->where('category', 'Type');
    }

    public function disabilityCause()
    {
        return $this->belongsTo(DisabilityList::class, 'disability_cause_id')
                    ->where('category', 'Cause');
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

    public function renewals()
    {
        return $this->hasMany(PWDRenewalAndPreregistration::class, 'user_id', 'user_id');
    }

}
