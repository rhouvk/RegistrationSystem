<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;

// Controllers
use App\Http\Controllers\{
    ProfileController,
    AdminControlController,
    AdminDashboardController,
    AdminBnpcItemController,
    AdminDisabilityController,
    PWDBarcodeController,
    PWDUserBarcodeController,
    PWDRegistrationController,
    PWDDashboardController,
    PWDUserController,
    PWDBnpcController,
    PWDMedicinePurchaseController,
    PWDAnalyticsController,
    PWDScannerController,
    BusinessEditTransactionController,
    BusinessDashboardController,
    BusinessBnpcController,
    BusinessSalesLogController,
    BusinessPharmacyRegisterController,
    PharmacyDashboardController,
    PharmacyPrescriptionController,
    PharmacyPrescriptionLogController,
    PharmacyPrescriptionEditController,
    PayMongoController,
    PharmacyUpdateController,
    LocationController,
    AdminDistrictDetailsController,
    PWDRenewalController,
    PWDRenewalApprovalController,
    PWDInitialRegistrationController,
    PWDAdditionalInfoController,
    PWDPreregistrationApprovalController,
    BusinessPharmacyController,
};

use App\Models\PWDRegistration;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin'       => Route::has('login'),
        'canRegister'    => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion'     => PHP_VERSION,
    ]);
})->name('welcome');

// Initial PWD Registration Routes (Public)
Route::get('/pwd/initial-registration', [PWDInitialRegistrationController::class, 'show'])->name('pwd.initial-registration');
Route::post('/pwd/initial-registration', [PWDInitialRegistrationController::class, 'store'])->name('pwd.initial-registration.store');

// PWD Additional Information Routes (Public)
Route::get('/pwd/additional-info', [PWDAdditionalInfoController::class, 'show'])
    ->name('pwd.additional-info.show');
Route::post('/pwd/additional-info', [PWDAdditionalInfoController::class, 'store'])
    ->name('pwd.additional-info.store');

Route::get('/dashboard', fn() => Inertia::render('Dashboard'))
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::get('/scan', fn() => Inertia::render('Scan'))->name('public.scan');
Route::get('/api/scan-user', [PWDScannerController::class, 'findByHashId']);

Route::middleware(['auth'])->group(function () {
    Route::get('/subscribe', fn() => Inertia::render('Subscription/Subscribe'))->name('subscription.page');

    Route::post('/paymongo/subscribe', [PayMongoController::class, 'subscribe'])->name('subscription.subscribe');

    // ✅ Replace this:
    // Route::get('/subscribe/success', fn() => Inertia::render('Subscription/Success'))->name('subscription.success');

    // ✅ With this:
    Route::get('/subscribe/success', [PayMongoController::class, 'success'])->name('subscription.success');

    Route::get('/subscribe/cancel', fn() => Inertia::render('Subscription/Cancel'))->name('subscription.cancel');
});

/*
|--------------------------------------------------------------------------
| Profile
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

/*
|--------------------------------------------------------------------------
| Business Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'can:business'])->group(function () {
    Route::get('/business/dashboard', [BusinessDashboardController::class, 'index'])->name('business.dashboard');
    Route::get('/business/sales-log', [BusinessSalesLogController::class, 'index'])->name('business.sales-log');
    Route::get('/business/transactions/create', [BusinessBnpcController::class, 'create'])->name('business.bnpc-transactions.create');
    Route::post('/business/transactions', [BusinessBnpcController::class, 'store'])->name('business.bnpc-transactions.store');
    Route::get('/business/bnpc-transactions/{id}/edit', [BusinessEditTransactionController::class, 'edit'])->name('business.bnpc-transactions.edit');
    Route::put('/business/bnpc-transactions/{id}', [BusinessEditTransactionController::class, 'update'])->name('business.bnpc-transactions.update');
});

/*
|--------------------------------------------------------------------------
| Pharmacy Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'can:pharmacy'])->group(function () {
    Route::get('/pharmacy/dashboard', [PharmacyDashboardController::class, 'index'])->name('pharmacy.dashboard');
    // Record Prescription (Pharmacy Side)
    Route::get('/pharmacy/record-prescription', [PharmacyPrescriptionController::class, 'create'])->name('pharmacy.prescriptions.create');
    Route::post('/pharmacy/record-prescription', [PharmacyPrescriptionController::class, 'store'])->name('pharmacy.prescriptions.store');

    Route::get('/pharmacy/prescription-log', [PharmacyPrescriptionLogController::class, 'index'])->name('pharmacy.prescriptions.log');

    // Update Prescription Filling
    Route::get('/pharmacy/update-prescription', [PharmacyUpdateController::class, 'lookup'])
        ->name('pharmacy.prescriptions.update.create');

    Route::post('/pharmacy/update-prescription', [PharmacyUpdateController::class, 'update'])
        ->name('pharmacy.prescriptions.update');

    Route::get('/prescriptions/{id}/edit', [PharmacyPrescriptionEditController::class, 'edit'])->name('prescriptions.edit');
    Route::put('/prescriptions/{id}', [PharmacyPrescriptionEditController::class, 'update'])->name('prescriptions.update');
});

/*
|--------------------------------------------------------------------------
| PWD Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'can:pwd'])->group(function () {
    Route::get('/pwd/dashboard', [PWDDashboardController::class, 'index'])->name('pwd.dashboard');
    Route::get('/pwd/bnpc-purchases', [PWDBnpcController::class, 'index'])->name('pwd.bnpc-purchases.index');

    Route::get('/pwd/medicine-purchases', [PWDMedicinePurchaseController::class, 'index'])
        ->name('pwd.medicine-purchases.index');
    
    Route::get('/pwd/analytics', [PWDAnalyticsController::class, 'index'])
        ->name('pwd.analytics.index'); // ✅ Add this line

    Route::get('/pwd/card', [PWDUserBarcodeController::class, 'generate'])->name('pwd.pwd-users.dashboard.generate');
    Route::get('/pwd/renewal/{registration}', [PWDRenewalController::class, 'create'])->name('pwd.renewal.create');

    Route::post('/pwd/renewal', [PWDRenewalController::class, 'store'])->name('pwd.renewals.store');
    Route::get('/pwd/renewal/{registration}', [PWDRenewalController::class, 'create'])->name('pwd.renewal.create');
    Route::get('/pwd/renewals/{renewal}/edit', [PWDRenewalController::class, 'edit'])->name('pwd.renewal.edit');
    Route::match(['put', 'post'], '/pwd/renewals/{renewal}', [PWDRenewalController::class, 'update'])->name('pwd.renewals.update');
});

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'can:admin'])->group(function () {
    Route::get('/admin/register', [PWDRegistrationController::class, 'create'])->name('pwd.register');
    Route::post('/admin/register', [PWDRegistrationController::class, 'store']);
    Route::post('/admin/check-duplicates', [PWDRegistrationController::class, 'checkDuplicates'])->name('pwd.check-duplicates');

    Route::get('/admin/scan', fn() => Inertia::render('Admin/Scan'))->name('pwd.scan');

    Route::get('/admin/PWDusers', [PWDUserController::class, 'index'])->name('pwd.pwd-users.index');
    Route::get('/admin/PWDusers/{id}/edit', [PWDUserController::class, 'edit'])->name('pwd.pwd-users.edit');
    Route::match(['put', 'post'], '/admin/PWDusers/{id}', [PWDUserController::class, 'update'])->name('pwd.pwd-users.update');
    Route::get('/admin/PWDusers/{id}/generate', [PWDBarcodeController::class, 'generate'])->name('pwd.pwd-users.generate');

    Route::get('/admin/bnpc', [AdminBnpcItemController::class, 'index'])->name('admin.bnpc.index');
    Route::post('/admin/bnpc', [AdminBnpcItemController::class, 'store'])->name('admin.bnpc.store');
    Route::put('/admin/bnpc/{id}', [AdminBnpcItemController::class, 'update'])->name('admin.bnpc.update');
    Route::delete('/admin/bnpc/{id}', [AdminBnpcItemController::class, 'destroy'])->name('admin.bnpc.destroy');

    Route::post('/admin/disability', [AdminDisabilityController::class, 'store'])->name('admin.disability.store');
    Route::put('/admin/disability/{disability}', [AdminDisabilityController::class, 'update'])->name('admin.disability.update');
    Route::delete('/admin/disability/{disability}', [AdminDisabilityController::class, 'destroy'])->name('admin.disability.destroy');

    Route::get('/admin/controls', [AdminControlController::class, 'index'])->name('admin.controls.index');
    Route::put('/admin/controls', [AdminControlController::class, 'update'])->name('admin.controls.update');

    Route::get('/admin/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');

    Route::get('/admin/district/{districtName}/details', [AdminDistrictDetailsController::class, 'getDistrictDetails'])->name('admin.district.details');

    Route::post('/admin/register/bp', [BusinessPharmacyRegisterController::class, 'store'])->name('register.bp');
    Route::get('/admin/register-bp', function () {
        return Inertia::render('Admin/RegisterBusinessOrPharmacy');
    })->name('register.bp.view');

        Route::get('/admin/business-pharmacy', [BusinessPharmacyController::class, 'index'])
        ->name('admin.business-pharmacy.index');
    Route::get('/admin/business-pharmacy/{id}/edit', [BusinessPharmacyController::class, 'edit'])
        ->name('admin.business-pharmacy.edit');
    Route::put('/admin/business-pharmacy/{id}', [BusinessPharmacyController::class, 'update'])
        ->name('admin.business-pharmacy.update');
});


/*
|--------------------------------------------------------------------------
| Lookup Route
|--------------------------------------------------------------------------
*/

Route::get('/pwdusers', function (Request $request) {
    $pwdNumber = trim($request->input('pwdNumber'));
    $user = PWDRegistration::with('user')
        ->whereRaw('LOWER(pwdNumber) = ?', [strtolower($pwdNumber)])
        ->first();
    return response()->json(['user' => $user]);
})->name('pwd.users.get');

/*
|--------------------------------------------------------------------------
| Location API Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth'])->group(function () {
    Route::get('/api/provinces', [LocationController::class, 'provinces']);
    Route::get('/api/municipalities', [LocationController::class, 'municipalities']);
    Route::get('/api/barangays', [LocationController::class, 'barangays']);
});

/*
|--------------------------------------------------------------------------
| Admin PWD Renewal Approval Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'can:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/pwd/renewals', [PWDRenewalApprovalController::class, 'index'])->name('pwd.renewals.index');
    Route::get('/pwd/renewals/{renewal}', [PWDRenewalApprovalController::class, 'show'])->name('pwd.renewals.show');
    Route::post('/pwd/renewals/{renewal}/approve', [PWDRenewalApprovalController::class, 'approve'])->name('pwd.renewals.approve');
    Route::post('/pwd/renewals/{renewal}/reject', [PWDRenewalApprovalController::class, 'reject'])->name('pwd.renewals.reject');

    // Pre-registration Approval Routes
    Route::get('/pwd/preregistrations', [PWDPreregistrationApprovalController::class, 'index'])->name('pwd.preregistrations.index');
    Route::get('/pwd/preregistrations/{preregistration}', [PWDPreregistrationApprovalController::class, 'show'])->name('pwd.preregistrations.show');
    Route::post('/pwd/preregistrations/{preregistration}/approve', [PWDPreregistrationApprovalController::class, 'approve'])->name('pwd.preregistrations.approve');
    Route::post('/pwd/preregistrations/{preregistration}/reject', [PWDPreregistrationApprovalController::class, 'reject'])->name('pwd.preregistrations.reject');
});

Route::get('/validation-required', function () {
    return Inertia::render('Auth/ValidationRequired', [
        'requiredDocuments' => session('requiredDocuments'),
        'userType' => session('userType')
    ]);
})->name('validation.required');

// Business Registration Routes
Route::get('/register/business', function () {
    return Inertia::render('RegisterBusiness');
})->name('register.business');

Route::post('/register/business', [BusinessPharmacyRegisterController::class, 'store'])->name('register.business.store');

Route::get('/register/pharmacy', function () {
    return Inertia::render('RegisterPharmacy');
})->name('register.pharmacy');

require __DIR__ . '/auth.php';
