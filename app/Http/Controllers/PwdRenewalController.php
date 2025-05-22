<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\PWDRegistration;
use App\Models\PwdRenewalAndPreregistration;
use App\Models\DisabilityList;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class PwdRenewalController extends Controller
{
    public function create(Request $request, PWDRegistration $registration)
    {
        // Check if user already has a pending renewal request
        $existingRenewal = PwdRenewalAndPreregistration::where('user_id', Auth::id())
            ->where('registration_type', 2) // 2 for renewal
            ->first();

        if ($existingRenewal) {
            return redirect()->route('pwd.dashboard')
                ->with('error', 'You already have a pending renewal request.');
        }

        // Simple check - if not the owner, redirect to dashboard
        if (Auth::user()->id !== $registration->user_id) {
            return redirect()->route('pwd.dashboard');
        }

        // If based_on parameter is provided, get that renewal request
        $basedOnRenewal = null;
        if ($request->has('based_on')) {
            $basedOnRenewal = PwdRenewalAndPreregistration::findOrFail($request->based_on);
            // Verify ownership
            if ($basedOnRenewal->user_id !== Auth::id()) {
                return redirect()->route('pwd.dashboard');
            }
        }

        return Inertia::render('PWD/RenewalRequest', [
            'registration' => $registration,
            'basedOnRenewal' => $basedOnRenewal,
            'disabilityTypes' => DisabilityList::where('category', 'Type')->get(),
            'disabilityCauses' => DisabilityList::where('category', 'Cause')->get(),
            'regions' => \App\Models\Region::all(),
            'provinces' => \App\Models\Province::where('region_id', $registration->region_id)->get(),
            'municipalities' => \App\Models\Municipality::where('province_id', $registration->province_id)->get(),
            'barangays' => \App\Models\Barangay::where('municipality_id', $registration->municipality_id)->get(),
        ]);
    }

    public function edit(PwdRenewalAndPreregistration $renewal)
    {
        // Check if user owns this renewal request
        if (Auth::user()->id !== $renewal->user_id) {
            return redirect()->route('pwd.dashboard');
        }

        // Check if renewal is still pending (registration_type = 2)
        if ($renewal->registration_type !== 2) {
            return redirect()->route('pwd.dashboard')
                ->with('error', 'This renewal request can no longer be edited.');
        }

        return Inertia::render('PWD/RenewalRequest', [
            'registration' => $renewal->pwdUser,
            'renewal' => $renewal,
            'disabilityTypes' => DisabilityList::where('category', 'Type')->get(),
            'disabilityCauses' => DisabilityList::where('category', 'Cause')->get(),
            'regions' => \App\Models\Region::all(),
            'provinces' => \App\Models\Province::where('region_id', $renewal->region_id)->get(),
            'municipalities' => \App\Models\Municipality::where('province_id', $renewal->province_id)->get(),
            'barangays' => \App\Models\Barangay::where('municipality_id', $renewal->municipality_id)->get(),
        ]);
    }

    public function update(Request $request, PwdRenewalAndPreregistration $renewal)
    {
        // Check if user owns this renewal request
        if (Auth::user()->id !== $renewal->user_id) {
            return redirect()->route('pwd.dashboard');
        }

        // Check if renewal is still pending (registration_type = 2)
        if ($renewal->registration_type !== 2) {
            return redirect()->route('pwd.dashboard')
                ->with('error', 'This renewal request can no longer be edited.');
        }

        try {
            Log::info('Update request data:', [
                'request_data' => $request->all(),
                'files' => $request->allFiles(),
                'renewal_id' => $renewal->id,
                'renewal_user_id' => $renewal->user_id,
                'current_photo' => $renewal->photo,
                'current_signature' => $renewal->signature,
                'has_photo_file' => $request->hasFile('photo'),
                'has_signature_file' => $request->hasFile('signature')
            ]);

            // Base validation rules
            $rules = [];

            // Only validate fields that are present in the request
            if ($request->has('pwdNumber')) {
                $rules['pwdNumber'] = [
                    'required',
                    'string',
                    'max:255',
                    function ($attribute, $value, $fail) use ($renewal) {
                        $exists = PwdRenewalAndPreregistration::where('pwdNumber', $value)
                            ->where('user_id', '!=', Auth::id())
                            ->exists();
                        
                        if ($exists) {
                            $fail('This PWD number is already in use by another user.');
                        }
                    }
                ];
            }

            // Add validation rules for other fields only if they are present
            $optionalFields = [
                'dateApplied' => 'required|date',
                'first_name' => 'required|string|max:255',
                'middle_name' => 'nullable|string|max:255',
                'last_name' => 'required|string|max:255',
                'suffix' => 'nullable|string|max:255',
                'dob' => 'required|date',
                'sex' => ['required', 'string', 'in:male,female,Male,Female'],
                'civilStatus' => ['required', 'string', 'in:single,married,widowed,separated,Single,Married,Widowed,Separated'],
                'disability_type_id' => 'required|exists:disability_lists,id',
                'disability_cause_id' => 'required|exists:disability_lists,id',
                'region_id' => 'required|exists:regions,id',
                'province_id' => 'required|exists:provinces,id',
                'municipality_id' => 'required|exists:municipalities,id',
                'barangay_id' => 'required|exists:barangays,id',
                'house' => 'required|string|max:255',
                'landline' => 'nullable|string|max:255',
                'education' => 'required|string|max:255',
                'employmentStatus' => 'required|string|max:255',
                'employmentCategory' => 'nullable|string|max:255',
                'employmentType' => 'nullable|string|max:255',
                'occupation' => 'nullable|string|max:255',
                'occupationOther' => 'nullable|string|max:255',
                'organizationAffiliated' => 'nullable|string|max:255',
                'organizationContact' => 'nullable|string|max:255',
                'organizationAddress' => 'nullable|string|max:255',
                'organizationTel' => 'nullable|string|max:255',
                'sssNo' => 'nullable|string|max:255',
                'gsisNo' => 'nullable|string|max:255',
                'pagIbigNo' => 'nullable|string|max:255',
                'psnNo' => 'nullable|string|max:255',
                'philhealthNo' => 'nullable|string|max:255',
                'father_first_name' => 'nullable|string|max:255',
                'father_middle_name' => 'nullable|string|max:255',
                'father_last_name' => 'nullable|string|max:255',
                'mother_first_name' => 'nullable|string|max:255',
                'mother_middle_name' => 'nullable|string|max:255',
                'mother_last_name' => 'nullable|string|max:255',
                'guardian_first_name' => 'nullable|string|max:255',
                'guardian_middle_name' => 'nullable|string|max:255',
                'guardian_last_name' => 'nullable|string|max:255',
                'accomplishedBy' => 'required|in:applicant,guardian,representative',
                'accomplished_by_first_name' => 'nullable|string|max:255',
                'accomplished_by_middle_name' => 'nullable|string|max:255',
                'accomplished_by_last_name' => 'nullable|string|max:255',
            ];

            foreach ($optionalFields as $field => $rule) {
                if ($request->has($field)) {
                    $rules[$field] = $rule;
                }
            }

            // Always validate photo and signature if present
            if ($request->hasFile('photo')) {
                $rules['photo'] = 'required|image|max:2048';
            } else if ($request->has('photo')) {
                $rules['photo'] = 'nullable|string|max:255';
            }

            if ($request->hasFile('signature')) {
                $rules['signature'] = 'required|image|max:2048';
            } else if ($request->has('signature')) {
                $rules['signature'] = 'nullable|string|max:255';
            }

            $validated = $request->validate($rules);

            // Handle photo update
            if ($request->hasFile('photo')) {
                Log::info('Processing new photo upload');
                
                // Get the original registration photo
                $originalRegistration = PWDRegistration::where('user_id', Auth::id())->first();
                $originalPhoto = $originalRegistration ? $originalRegistration->photo : null;
                
                // Only delete if it's not the same as the original registration photo
                if ($renewal->photo && 
                    Storage::disk('public')->exists($renewal->photo) && 
                    $renewal->photo !== $originalPhoto) {
                    Log::info('Deleting old renewal photo:', ['path' => $renewal->photo]);
                    Storage::disk('public')->delete($renewal->photo);
                }

                // Store new photo
                $photoFile = $request->file('photo');
                $photoName = 'photo_' . time() . '_' . uniqid() . '.png';
                $photoPath = 'photos/' . $photoName;
                $photoFile->storeAs('photos', $photoName, 'public');
                $validated['photo'] = $photoPath;
                Log::info('New photo saved:', ['path' => $photoPath]);
            } else if ($request->has('photo')) {
                // Use the provided photo path
                $validated['photo'] = $request->photo;
                Log::info('Using existing photo path:', ['path' => $request->photo]);
            } else {
                // Preserve existing photo
                $validated['photo'] = $renewal->photo;
                Log::info('Preserving existing photo:', ['path' => $renewal->photo]);
            }

            // Handle signature update
            if ($request->hasFile('signature')) {
                Log::info('Processing new signature upload');
                
                // Get the original registration signature
                $originalRegistration = PWDRegistration::where('user_id', Auth::id())->first();
                $originalSignature = $originalRegistration ? $originalRegistration->signature : null;
                
                // Only delete if it's not the same as the original registration signature
                if ($renewal->signature && 
                    Storage::disk('public')->exists($renewal->signature) && 
                    $renewal->signature !== $originalSignature) {
                    Log::info('Deleting old renewal signature:', ['path' => $renewal->signature]);
                    Storage::disk('public')->delete($renewal->signature);
                }

                // Store new signature
                $signatureFile = $request->file('signature');
                $sigName = 'signature_' . time() . '_' . uniqid() . '.' . $signatureFile->getClientOriginalExtension();
                $sigPath = $signatureFile->storeAs('signatures', $sigName, 'public');
                $validated['signature'] = $sigPath;
                Log::info('New signature saved:', ['path' => $sigPath]);
            } else if ($request->has('signature')) {
                // Use the provided signature path
                $validated['signature'] = $request->signature;
                Log::info('Using existing signature path:', ['path' => $request->signature]);
            } else {
                // Preserve existing signature
                $validated['signature'] = $renewal->signature;
                Log::info('Preserving existing signature:', ['path' => $renewal->signature]);
            }

            Log::info('Updating renewal with data:', [
                'photo' => $validated['photo'],
                'signature' => $validated['signature']
            ]);

            // Update only the fields that were validated
            $renewal->fill($validated);
            $renewal->save();

            Log::info('Renewal updated successfully:', [
                'renewal_id' => $renewal->id,
                'photo' => $renewal->photo,
                'signature' => $renewal->signature
            ]);

            return redirect()->route('pwd.dashboard')
                ->with('success', 'Renewal request updated successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to update renewal request', [
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->withErrors(['error' => 'Failed to update renewal request. Please try again.'])
                        ->withInput();
        }
    }

    public function store(Request $request)
    {
        Log::info('Renewal request received', ['request_data' => $request->all()]);
        Log::info('Files in request:', $request->allFiles());

        try {
            // Find existing renewal request (including expired ones)
            $renewal = PwdRenewalAndPreregistration::where('user_id', Auth::id())
                ->where('pwdNumber', $request->pwdNumber)
                ->first();

            // If no existing renewal found, create a new one
            if (!$renewal) {
                $renewal = new PwdRenewalAndPreregistration();
                $renewal->user_id = Auth::id();
                $renewal->registration_type = 2; // 2 for renewal
            } else {
                // If found, update the registration type to renewal
                $renewal->registration_type = 2;
            }

            // Create validation rules array
            $rules = [
                'pwdNumber' => [
                    'required',
                    'string',
                    'max:255',
                    function ($attribute, $value, $fail) use ($renewal) {
                        $exists = PwdRenewalAndPreregistration::where('pwdNumber', $value)
                            ->where('user_id', '!=', Auth::id())
                            ->exists();
                        
                        if ($exists) {
                            $fail('This PWD number is already in use by another user.');
                        }
                    }
                ],
                'dateApplied' => 'required|date',
                'first_name' => 'required|string|max:255',
                'middle_name' => 'nullable|string|max:255',
                'last_name' => 'required|string|max:255',
                'suffix' => 'nullable|string|max:255',
                'dob' => 'required|date',
                'sex' => ['required', 'string', 'in:male,female,Male,Female'],
                'civilStatus' => ['required', 'string', 'in:single,married,widowed,separated,Single,Married,Widowed,Separated'],
                'disability_type_id' => 'required|exists:disability_lists,id',
                'disability_cause_id' => 'required|exists:disability_lists,id',
                'region_id' => 'required|exists:regions,id',
                'province_id' => 'required|exists:provinces,id',
                'municipality_id' => 'required|exists:municipalities,id',
                'barangay_id' => 'required|exists:barangays,id',
                'house' => 'required|string|max:255',
                'landline' => 'nullable|string|max:255',
                'mobile' => 'nullable|string|max:255',
                'email' => 'nullable|email|max:255',
                'education' => 'required|string|max:255',
                'employmentStatus' => 'required|string|max:255',
                'employmentCategory' => 'nullable|string|max:255',
                'employmentType' => 'nullable|string|max:255',
                'occupation' => 'nullable|string|max:255',
                'occupationOther' => 'nullable|string|max:255',
                'organizationAffiliated' => 'nullable|string|max:255',
                'organizationContact' => 'nullable|string|max:255',
                'organizationAddress' => 'nullable|string|max:255',
                'organizationTel' => 'nullable|string|max:255',
                'sssNo' => 'nullable|string|max:255',
                'gsisNo' => 'nullable|string|max:255',
                'pagIbigNo' => 'nullable|string|max:255',
                'psnNo' => 'nullable|string|max:255',
                'philhealthNo' => 'nullable|string|max:255',
                'father_first_name' => 'nullable|string|max:255',
                'father_middle_name' => 'nullable|string|max:255',
                'father_last_name' => 'nullable|string|max:255',
                'mother_first_name' => 'nullable|string|max:255',
                'mother_middle_name' => 'nullable|string|max:255',
                'mother_last_name' => 'nullable|string|max:255',
                'guardian_first_name' => 'nullable|string|max:255',
                'guardian_middle_name' => 'nullable|string|max:255',
                'guardian_last_name' => 'nullable|string|max:255',
                'accomplishedBy' => 'required|string|max:255',
                'accomplished_by_first_name' => 'required|string|max:255',
                'accomplished_by_middle_name' => 'nullable|string|max:255',
                'accomplished_by_last_name' => 'required|string|max:255',
                'photo' => 'nullable|string|max:255',
                'signature' => 'nullable|string|max:255',
            ];

            // Only add photo and signature validation if new files are being uploaded
            if ($request->hasFile('photo')) {
                $rules['photo'] = 'required|image|max:2048';
            }
            if ($request->hasFile('signature')) {
                $rules['signature'] = 'required|image|max:2048';
            }

            $validated = $request->validate($rules);
            Log::info('Validation passed', ['validated_data' => $validated]);

            // Handle file uploads
            if ($request->hasFile('photo')) {
                $photoFile = $request->file('photo');
                $photoName = 'photo_' . time() . '_' . uniqid() . '.png';
                $photoPath = 'photos/' . $photoName;
                $photoFile->storeAs('photos', $photoName, 'public');
                $validated['photo'] = $photoPath;
            } else if ($request->has('photo')) {
                // Use the provided photo path
                $validated['photo'] = $request->photo;
            } else {
                // If this is a new renewal and no new photo uploaded, copy from registration
                if (!$renewal->exists && $request->has('registration_id')) {
                    $registration = PWDRegistration::find($request->registration_id);
                    if ($registration && $registration->photo) {
                        // Copy the photo file
                        $newPhotoName = 'photo_' . time() . '_' . uniqid() . '.png';
                        $newPhotoPath = 'photos/' . $newPhotoName;
                        
                        if (Storage::disk('public')->exists($registration->photo)) {
                            Storage::disk('public')->copy($registration->photo, $newPhotoPath);
                            $validated['photo'] = $newPhotoPath;
                            Log::info('Copied photo from registration:', ['from' => $registration->photo, 'to' => $newPhotoPath]);
                        }
                    }
                } else {
                    // Preserve existing photo
                    $validated['photo'] = $renewal->photo;
                }
            }

            if ($request->hasFile('signature')) {
                $signatureFile = $request->file('signature');
                $sigName = 'signature_' . time() . '_' . uniqid() . '.' . $signatureFile->getClientOriginalExtension();
                $sigPath = $signatureFile->storeAs('signatures', $sigName, 'public');
                $validated['signature'] = $sigPath;
            } else if ($request->has('signature')) {
                // Use the provided signature path
                $validated['signature'] = $request->signature;
            } else {
                // If this is a new renewal and no new signature uploaded, copy from registration
                if (!$renewal->exists && $request->has('registration_id')) {
                    $registration = PWDRegistration::find($request->registration_id);
                    if ($registration && $registration->signature) {
                        // Copy the signature file
                        $newSigName = 'signature_' . time() . '_' . uniqid() . '.' . pathinfo($registration->signature, PATHINFO_EXTENSION);
                        $newSigPath = 'signatures/' . $newSigName;
                        
                        if (Storage::disk('public')->exists($registration->signature)) {
                            Storage::disk('public')->copy($registration->signature, $newSigPath);
                            $validated['signature'] = $newSigPath;
                            Log::info('Copied signature from registration:', ['from' => $registration->signature, 'to' => $newSigPath]);
                        }
                    }
                } else {
                    // Preserve existing signature
                    $validated['signature'] = $renewal->signature;
                }
            }

            // Update or create the renewal request
            $renewal->fill($validated);
            $renewal->save();
            Log::info('Renewal request updated/created', ['renewal_id' => $renewal->id]);

            return redirect()->route('pwd.dashboard')
                ->with('success', 'Renewal request submitted successfully.');

        } catch (\Exception $e) {
            Log::error('Failed to save renewal request', [
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->withErrors(['error' => 'Failed to save renewal request. Please try again.'])
                        ->withInput();
        }
    }
} 