<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PWDRegistration;
use App\Models\User;
use App\Models\Region;
use App\Models\Province;
use App\Models\Municipality;
use App\Models\Barangay;
use App\Models\DisabilityList;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;




class PWDRegistrationController extends Controller
{
    /**
     * Show the PWD Registration Form.
     */

     public function findByPWDNumber(Request $request)
     {
         $pwdNumber = trim($request->input('pwdNumber'));
     
         $user = PWDRegistration::with([
             'user',
             'disabilitytype',
             'disabilitycause',
             'barangay',
             'municipality',
             'province',
             'region',
         ])->whereRaw('LOWER(pwdNumber) = ?', [strtolower($pwdNumber)])
           ->first();
     
         return response()->json(['user' => $user]);
     }
     


    public function create()
    {
        return Inertia::render('Admin/Register', [
            'regions' => Region::select('id', 'name')->orderBy('name')->get(),
            'provinces' => Province::with('region:id,name')->select('id', 'name', 'region_id')->orderBy('name')->get(),
            'municipalities' => Municipality::with('province:id,name,region_id')->select('id', 'name', 'province_id')->orderBy('name')->get(),
            'barangays' => Barangay::with('municipality:id,name,province_id')->select('id', 'name', 'municipality_id')->orderBy('name')->get(),
            'disabilityTypes' => DisabilityList::where('category', 'Type')->select('id', 'name')->orderBy('name')->get(),
            'disabilityCauses' => DisabilityList::where('category', 'Cause')->select('id', 'name')->orderBy('name')->get(),
        ]);
    }

    /**
     * Store the submitted PWD Registration.
     */
        public function store(Request $request)
        {
            try {
                \Log::info('PWD Registration Request Data:', $request->all());

                $request->validate([
                    'pwdNumber'           => 'required|unique:pwd_users,pwdNumber',
                    'dateApplied'         => 'required|date',
                    'first_name'          => 'required|string|max:255',
                    'last_name'           => 'required|string|max:255',
                    'dob'                 => 'required|date',
                    'sex'                 => 'required|string',
                    'civilStatus'         => 'required|string',
                    'disability_type_id'  => 'required|exists:disability_lists,id',
                    'disability_cause_id' => 'required|exists:disability_lists,id',
                    'region_id'           => 'required|exists:regions,id',
                    'province_id'         => 'required|exists:provinces,id',
                    'municipality_id'     => 'required|exists:municipalities,id',
                    'barangay_id'         => 'required|exists:barangays,id',
                    'mobile'              => 'nullable|string|max:20',
                    'email'               => 'nullable|email|max:255',
                    'accomplishedBy'      => 'required|in:applicant,guardian,representative',
                    'accomplished_by_first_name' => 'required|string|max:255',
                    'accomplished_by_last_name'  => 'required|string|max:255',
                    'processing_officer_first_name' => 'required|string|max:255',
                    'processing_officer_last_name'  => 'required|string|max:255',
                    'approving_officer_first_name'  => 'required|string|max:255',
                    'approving_officer_last_name'   => 'required|string|max:255',
                    'encoder_first_name'           => 'required|string|max:255',
                    'encoder_last_name'            => 'required|string|max:255',
                    'photo'               => 'nullable|image|max:2048',
                    'signature'           => 'nullable|image|max:2048',
                ]);

                DB::beginTransaction();

                try {
                    $fullName = trim("{$request->first_name} {$request->middle_name} {$request->last_name} {$request->suffix}");
                    $password = Hash::make($request->last_name . date('mdY', strtotime($request->dob)));

                    $user = User::create([
                        'name'     => $fullName,
                        'email'    => $request->email,
                        'phone'    => $request->mobile,
                        'role'     => 0,
                        'password' => $password,
                    ]);

                    \Log::info('User created:', ['user_id' => $user->id]);

                    $pwdData = [
                        'user_id'             => $user->id,
                        'pwdNumber'           => $request->pwdNumber,
                        'dateApplied'         => $request->dateApplied,
                        'dob'                 => $request->dob,
                        'sex'                 => $request->sex,
                        'civilStatus'         => $request->civilStatus,
                        'first_name'          => $request->first_name,
                        'middle_name'         => $request->middle_name,
                        'last_name'           => $request->last_name,
                        'suffix'              => $request->suffix,
                        'father_first_name'   => $request->father_first_name,
                        'father_middle_name'  => $request->father_middle_name,
                        'father_last_name'    => $request->father_last_name,
                        'mother_first_name'   => $request->mother_first_name,
                        'mother_middle_name'  => $request->mother_middle_name,
                        'mother_last_name'    => $request->mother_last_name,
                        'guardian_first_name' => $request->guardian_first_name,
                        'guardian_middle_name'=> $request->guardian_middle_name,
                        'guardian_last_name'  => $request->guardian_last_name,
                        'accomplished_by_first_name' => $request->accomplished_by_first_name,
                        'accomplished_by_middle_name'=> $request->accomplished_by_middle_name,
                        'accomplished_by_last_name'  => $request->accomplished_by_last_name,
                        'certifying_physician_first_name' => $request->certifying_physician_first_name,
                        'certifying_physician_middle_name'=> $request->certifying_physician_middle_name,
                        'certifying_physician_last_name'  => $request->certifying_physician_last_name,
                        'physician_license_no'           => $request->physician_license_no,
                        'processing_officer_first_name'  => $request->processing_officer_first_name,
                        'processing_officer_middle_name' => $request->processing_officer_middle_name,
                        'processing_officer_last_name'   => $request->processing_officer_last_name,
                        'approving_officer_first_name'   => $request->approving_officer_first_name,
                        'approving_officer_middle_name'  => $request->approving_officer_middle_name,
                        'approving_officer_last_name'    => $request->approving_officer_last_name,
                        'encoder_first_name'            => $request->encoder_first_name,
                        'encoder_middle_name'           => $request->encoder_middle_name,
                        'encoder_last_name'             => $request->encoder_last_name,
                        'disability_type_id'  => $request->disability_type_id,
                        'disability_cause_id' => $request->disability_cause_id,
                        'region_id'           => $request->region_id,
                        'province_id'         => $request->province_id,
                        'municipality_id'     => $request->municipality_id,
                        'barangay_id'         => $request->barangay_id,
                        'house'               => $request->house,
                        'landline'            => $request->landline,
                        'mobile'              => $request->mobile,
                        'email'               => $request->email,
                        'education'           => $request->education,
                        'employmentStatus'    => $request->employmentStatus,
                        'employmentCategory'  => $request->employmentCategory,
                        'employmentType'      => $request->employmentType,
                        'occupation'          => $request->occupation,
                        'occupationOther'     => $request->occupationOther,
                        'organizationAffiliated' => $request->organizationAffiliated,
                        'organizationContact'    => $request->organizationContact,
                        'organizationAddress'    => $request->organizationAddress,
                        'organizationTel'        => $request->organizationTel,
                        'sssNo'              => $request->sssNo,
                        'gsisNo'             => $request->gsisNo,
                        'pagIbigNo'          => $request->pagIbigNo,
                        'psnNo'              => $request->psnNo,
                        'philhealthNo'       => $request->philhealthNo,
                        'accomplishedBy'     => $request->accomplishedBy,
                        'reportingUnit'      => $request->reportingUnit,
                        'controlNo'          => $request->controlNo,
                    ];

                    \Log::info('Creating PWD registration with data:', $pwdData);

                    $registration = PWDRegistration::create($pwdData);

                    \Log::info('PWD registration created:', ['registration_id' => $registration->id]);

                    DB::commit();

                    if ($request->hasFile('photo')) {
                        $photoFile = $request->file('photo');
                        $photoName = 'photo_' . time() . '_' . uniqid() . '.png';
                        $image = imagecreatefromstring(file_get_contents($photoFile));
                        $photoPath = 'photos/' . $photoName;
                        imagepng($image, public_path('storage/' . $photoPath));
                        $registration->update(['photo' => $photoPath]);
                    }

                    if ($request->hasFile('signature')) {
                        $signatureFile = $request->file('signature');
                        $sigName = 'signature_' . time() . '_' . uniqid() . '.' . $signatureFile->getClientOriginalExtension();
                        $sigPath = $signatureFile->storeAs('signatures', $sigName, 'public');
                        $registration->update(['signature' => $sigPath]);
                    }

                    return redirect()->back()->with('success', 'PWD Registered Successfully!');
                } catch (\Exception $e) {
                    DB::rollBack();
                    \Log::error('Error in PWD registration transaction:', [
                        'message' => $e->getMessage(),
                        'line' => $e->getLine(),
                        'trace' => $e->getTraceAsString()
                    ]);
                    throw $e;
                }
            } catch (\Exception $e) {
                \Log::error('PWD Registration Error:', [
                    'message' => $e->getMessage(),
                    'line' => $e->getLine(),
                    'trace' => $e->getTraceAsString()
                ]);

                return redirect()->back()
                    ->withInput()
                    ->withErrors(['error' => 'Error registering PWD: ' . $e->getMessage()]);
            }
        }

    

    public function checkDuplicates(Request $request)
{
    $pwdExists = \App\Models\PWDRegistration::where('pwdNumber', $request->pwdNumber)->exists();
    $emailExists = \App\Models\User::where('email', $request->email)->exists();
    $phoneExists = \App\Models\User::where('phone', $request->phone)->exists();

    return response()->json([
        'pwdNumber' => PWDRegistration::where('pwdNumber', $request->pwdNumber)->exists() ? 'PWD number already exists.' : null,
        'email'     => User::where('email', $request->email)->exists() ? 'Email already exists.' : null,
        'phone'     => User::where('phone', $request->phone)->exists() ? 'Phone number already exists.' : null,
    ]);
}

    
    
}
