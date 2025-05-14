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
            $request->validate([
                'pwdNumber'           => 'required|unique:pwd_users,pwdNumber',
                'dateApplied'         => 'required|date',
                'firstName'           => 'required|string|max:255',
                'lastName'            => 'required|string|max:255',
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
                'encoder'             => 'required|string|max:255',
                'processingOfficer'   => 'required|string|max:255',
                'approvingOfficer'    => 'required|string|max:255',
                'physicianLicenseNo'  => 'nullable|string|max:8', // ✅ ADDED VALIDATION
                'photo'               => 'nullable|image|max:2048',
                'signature'           => 'nullable|image|max:2048',
            ]);

            DB::beginTransaction();

            try {
                $fullName = trim("{$request->firstName} {$request->middleName} {$request->lastName} {$request->suffix}");
                $password = Hash::make($request->lastName . date('mdY', strtotime($request->dob)));

                $user = User::create([
                    'name'     => $fullName,
                    'email'    => $request->email,
                    'phone'    => $request->mobile,
                    'role'     => 0,
                    'password' => $password,
                ]);

                $pwdData = [
                    'user_id'             => $user->id,
                    'pwdNumber'           => $request->pwdNumber,
                    'dateApplied'         => $request->dateApplied,
                    'dob'                 => $request->dob,
                    'sex'                 => $request->sex,
                    'civilStatus'         => $request->civilStatus,
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
                    'fatherName'         => trim("{$request->fatherFirstName} {$request->fatherMiddleName} {$request->fatherLastName}"),
                    'motherName'         => trim("{$request->motherFirstName} {$request->motherMiddleName} {$request->motherLastName}"),
                    'guardianName'       => trim("{$request->guardianFirstName} {$request->guardianMiddleName} {$request->guardianLastName}"),
                    'accomplishedBy' => $request->accomplishedBy === 'applicant'
                        ? 'Applicant'
                        : ucfirst($request->accomplishedBy) . ' - ' . collect([
                            $request->accomplishedFirstName,
                            $request->accomplishedMiddleName,
                            $request->accomplishedLastName
                        ])->filter()->unique()->implode(' '),
                    'certifyingPhysician'=> trim("{$request->certifyingPhysicianFirstName} {$request->certifyingPhysicianMiddleName} {$request->certifyingPhysicianLastName}"),
                    'physicianLicenseNo' => $request->physicianLicenseNo, // ✅ ADDED ASSIGNMENT
                    'encoder'            => $request->encoder,
                    'processingOfficer'  => $request->processingOfficer,
                    'approvingOfficer'   => $request->approvingOfficer,
                    'reportingUnit'      => $request->reportingUnit,
                    'controlNo'          => $request->controlNo,
                ];

                $photoFile = $request->file('photo');
                $signatureFile = $request->file('signature');

                $registration = PWDRegistration::create($pwdData);

                DB::commit();

                if ($photoFile) {
                    $photoName = 'photo_' . time() . '_' . uniqid() . '.png';
                    $image = imagecreatefromstring(file_get_contents($photoFile));
                    $photoPath = 'photos/' . $photoName;
                    imagepng($image, public_path('storage/' . $photoPath));
                    $registration->update(['photo' => $photoPath]);
                }

                if ($signatureFile) {
                    $sigName = 'signature_' . time() . '_' . uniqid() . '.' . $signatureFile->getClientOriginalExtension();
                    $sigPath = $signatureFile->storeAs('signatures', $sigName, 'public');
                    $registration->update(['signature' => $sigPath]);
                }

                return redirect()->back()->with('success', 'PWD Registered Successfully!');
            } catch (\Exception $e) {
                DB::rollBack();

                \Log::error('❌ PWD Registration Error', [
                    'message' => $e->getMessage(),
                    'line' => $e->getLine(),
                    'trace' => $e->getTraceAsString()
                ]);

                return redirect()->back()->with('error', 'Error registering PWD: ' . $e->getMessage());
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
