<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\PWDRenewalAndPreregistration;
use App\Models\DisabilityList;
use App\Models\Region;
use App\Models\Province;
use App\Models\Municipality;
use App\Models\Barangay;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class PWDAdditionalInfoController extends Controller
{
    public function show()
    {
        // Get initial registration data from session
        $initialData = session('pwd_initial_data');
        
        if (!$initialData) {
            Log::error('No initial registration data found in session');
            return redirect()->route('pwd.initial-registration.show')
                ->with('error', 'Please complete the initial registration first.');
        }

        Log::info('Retrieved initial registration data from session', $initialData);

        return Inertia::render('AdditionalInfo', [
            'initialData' => $initialData,
            'disabilityTypes' => DisabilityList::where('category', 'Type')->select('id', 'name')->orderBy('name')->get(),
            'disabilityCauses' => DisabilityList::where('category', 'Cause')->select('id', 'name')->orderBy('name')->get(),
            'regions' => Region::select('id', 'name')->orderBy('name')->get(),
            'provinces' => Province::with('region:id,name')->select('id', 'name', 'region_id')->orderBy('name')->get(),
            'municipalities' => Municipality::with('province:id,name,region_id')->select('id', 'name', 'province_id')->orderBy('name')->get(),
            'barangays' => Barangay::with('municipality:id,name,province_id')->select('id', 'name', 'municipality_id')->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        Log::info('Additional info form submitted', $request->all());

        // Get initial registration data from session
        $initialData = session('pwd_initial_data');
        
        if (!$initialData) {
            Log::error('No initial registration data found in session');
            return redirect()->route('pwd.initial-registration.show')
                ->with('error', 'Please complete the initial registration first.');
        }

        $validator = Validator::make($request->all(), [
            'disability_type_id' => 'required|exists:disability_lists,id',
            'disability_cause_id' => 'required|exists:disability_lists,id',
            'region_id' => 'required|exists:regions,id',
            'province_id' => 'required|exists:provinces,id',
            'municipality_id' => 'required|exists:municipalities,id',
            'barangay_id' => 'required|exists:barangays,id',
            'house' => 'required|string',
            'education' => 'required|string',
            'employmentStatus' => 'required|string',
            'employmentCategory' => 'nullable|string',
            'employmentType' => 'nullable|string',
            'occupation' => 'nullable|string',
            'organizationAffiliated' => 'nullable|string',
            'organizationContact' => 'nullable|string',
            'organizationAddress' => 'nullable|string',
            'organizationTel' => 'nullable|string',
            'sssNo' => 'nullable|string',
            'gsisNo' => 'nullable|string',
            'pagIbigNo' => 'nullable|string',
            'psnNo' => 'nullable|string',
            'philhealthNo' => 'nullable|string',
            'father_first_name' => 'required|string',
            'father_middle_name' => 'nullable|string',
            'father_last_name' => 'required|string',
            'mother_first_name' => 'required|string',
            'mother_middle_name' => 'nullable|string',
            'mother_last_name' => 'required|string',
            'guardian_first_name' => 'nullable|string',
            'guardian_middle_name' => 'nullable|string',
            'guardian_last_name' => 'nullable|string',
            'accomplishedBy' => 'required|string',
            'accomplished_by_first_name' => 'required|string',
            'accomplished_by_middle_name' => 'nullable|string',
            'accomplished_by_last_name' => 'required|string',
            'photo' => 'required|image|max:2048',
            'signature' => 'required|image|max:2048',
        ]);

        if ($validator->fails()) {
            Log::error('Validation failed', $validator->errors()->toArray());
            return back()->withErrors($validator)->withInput();
        }

        Log::info('Validation passed', $validator->validated());

        try {
            // Create user
            $user = User::create([
                'name' => trim("{$initialData['first_name']} {$initialData['middle_name']} {$initialData['last_name']} {$initialData['suffix']}"),
                'email' => $initialData['email'],
                'phone' => $initialData['phone'],
                'password' => Hash::make($initialData['password']),
                'role' => 0, // PWD role
                'is_validated' => 0, 
            ]);

            // Create PWD registration
            $registration = PWDRenewalAndPreregistration::create([
                'user_id' => $user->id,
                'registration_type' => 1,
                'first_name' => $initialData['first_name'],
                'middle_name' => $initialData['middle_name'],
                'last_name' => $initialData['last_name'],
                'suffix' => $initialData['suffix'],
                'dob' => $initialData['dob'],
                'sex' => $initialData['sex'],
                'civilStatus' => $initialData['civilStatus'],
                'disability_type_id' => $request->disability_type_id,
                'disability_cause_id' => $request->disability_cause_id,
                'region_id' => $request->region_id,
                'province_id' => $request->province_id,
                'municipality_id' => $request->municipality_id,
                'barangay_id' => $request->barangay_id,
                'house' => $request->house,
                'education' => $request->education,
                'employmentStatus' => $request->employmentStatus,
                'employmentCategory' => $request->employmentCategory,
                'employmentType' => $request->employmentType,
                'occupation' => $request->occupation,
                'organizationAffiliated' => $request->organizationAffiliated,
                'organizationContact' => $request->organizationContact,
                'organizationAddress' => $request->organizationAddress,
                'organizationTel' => $request->organizationTel,
                'sssNo' => $request->sssNo,
                'gsisNo' => $request->gsisNo,
                'pagIbigNo' => $request->pagIbigNo,
                'psnNo' => $request->psnNo,
                'philhealthNo' => $request->philhealthNo,
                'father_first_name' => $request->father_first_name,
                'father_middle_name' => $request->father_middle_name,
                'father_last_name' => $request->father_last_name,
                'mother_first_name' => $request->mother_first_name,
                'mother_middle_name' => $request->mother_middle_name,
                'mother_last_name' => $request->mother_last_name,
                'guardian_first_name' => $request->guardian_first_name,
                'guardian_middle_name' => $request->guardian_middle_name,
                'guardian_last_name' => $request->guardian_last_name,
                'accomplishedBy' => $request->accomplishedBy,
                'accomplished_by_first_name' => $request->accomplished_by_first_name,
                'accomplished_by_middle_name' => $request->accomplished_by_middle_name,
                'accomplished_by_last_name' => $request->accomplished_by_last_name,
            ]);

            // Handle photo upload
            if ($request->hasFile('photo')) {
                $photoFile = $request->file('photo');
                $photoName = 'photo_' . time() . '_' . uniqid() . '.png';
                $image = imagecreatefromstring(file_get_contents($photoFile));
                $photoPath = 'photos/' . $photoName;
                imagepng($image, public_path('storage/' . $photoPath));
                $registration->update(['photo' => $photoPath]);
            }

            // Handle signature upload
            if ($request->hasFile('signature')) {
                $signatureFile = $request->file('signature');
                $sigName = 'signature_' . time() . '_' . uniqid() . '.' . $signatureFile->getClientOriginalExtension();
                $sigPath = $signatureFile->storeAs('signatures', $sigName, 'public');
                $registration->update(['signature' => $sigPath]);
            }

            // Clear the session data
            session()->forget('pwd_initial_data');

            return redirect()->route('pwd.dashboard')
                ->with('success', 'Registration completed successfully!');
        } catch (\Exception $e) {
            Log::error('Error in additional info submission:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()
                ->withInput()
                ->withErrors(['error' => 'An error occurred while processing your registration. Please try again.']);
        }
    }
} 