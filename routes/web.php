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
    BusinessDashboardController,
    BusinessBnpcController,
    BusinessSalesLogController,
    PharmacyDashboardController,
    PharmacyPrescriptionController,
    PayMongoController,
    PharmacyUpdateController
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
});

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

Route::get('/pharmacy/prescription-log', [PharmacyPrescriptionController::class, 'index'])
    ->name('pharmacy.prescriptions.log');

// Update Prescription Filling
Route::get('/pharmacy/update-prescription', [PharmacyUpdateController::class, 'lookup'])
->name('pharmacy.prescriptions.update.create');

Route::post('/pharmacy/update-prescription', [PharmacyUpdateController::class, 'update'])
->name('pharmacy.prescriptions.update');




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
    Route::put('/admin/PWDusers/{id}', [PWDUserController::class, 'update'])->name('pwd.pwd-users.update');
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

require __DIR__ . '/auth.php';
