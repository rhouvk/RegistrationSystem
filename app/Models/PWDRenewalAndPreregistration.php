<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PWDRenewalAndPreregistration extends Model
{
    use HasFactory;

    protected $table = 'pwd_renewals_and_preregistrations';

    protected $fillable = [
        'user_id',
        'registration_type',
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
        'dateApplied' => 'date',
        'dob' => 'date',
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
     * Get the user that owns the registration.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the registration associated with this registration.
     */
    public function registration(): BelongsTo
    {
        return $this->belongsTo(PWDRegistration::class, 'user_id', 'user_id');
    }

    /**
     * Get the disability type.
     */
    public function disabilityType(): BelongsTo
    {
        return $this->belongsTo(DisabilityList::class, 'disability_type_id')
                    ->where('category', 'Type');
    }

    /**
     * Get the disability cause.
     */
    public function disabilityCause(): BelongsTo
    {
        return $this->belongsTo(DisabilityList::class, 'disability_cause_id')
                    ->where('category', 'Cause');
    }

    /**
     * Get the barangay.
     */
    public function barangay(): BelongsTo
    {
        return $this->belongsTo(Barangay::class);
    }

    /**
     * Get the municipality.
     */
    public function municipality(): BelongsTo
    {
        return $this->belongsTo(Municipality::class);
    }

    /**
     * Get the province.
     */
    public function province(): BelongsTo
    {
        return $this->belongsTo(Province::class);
    }

    /**
     * Get the region.
     */
    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class);
    }
}