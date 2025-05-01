<?php

use App\Http\Controllers\AdminControlController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\AdminBnpcItemController;
use App\Http\Controllers\AdminDisabilityController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PWDBarcodeController;
use App\Http\Controllers\PWDUserBarcodeController;
use App\Http\Controllers\PWDRegistrationController;
use App\Http\Controllers\PWDDashboardController;
use App\Http\Controllers\PWDUserController;
use App\Http\Controllers\PWDBnpcController;
use App\Http\Controllers\PWDScannerController;
use App\Http\Controllers\BusinessDashboardController;
use App\Http\Controllers\BusinessBnpcController;
use App\Http\Controllers\BusinessSalesLogController;
use App\Models\BnpcItem;
use App\Models\PWDRegistration;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])
  ->name('dashboard');


      // Profile management
    Route::get('/profile', [ProfileController::class, 'edit'])
         ->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])
         ->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])
         ->name('profile.destroy');


         
         Route::get('/scan', function () {
          return Inertia::render('Scan');
      })->name('public.scan');
       
 Route::get('/api/scan-user', [PWDScannerController::class, 'findByHashId']);


      

         
/*
|--------------------------------------------------------------------------
| Business Routes
|--------------------------------------------------------------------------
*/



Route::middleware(['auth', 'can:business'])->group(function () {
 Route::get('/business/dashboard', [BusinessDashboardController::class, 'index'])
                 ->name('business.dashboard');
                 
         // Sales log
         Route::get('/business/sales-log', [BusinessSalesLogController::class, 'index'])
              ->name('business.sales-log');

            
            Route::get('/business/transactions/create', [BusinessBnpcController::class, 'create'])
                 ->name('business.bnpc-transactions.create');
             Route::post('/business/transactions', [BusinessBnpcController::class, 'store'])
                 ->name('business.bnpc-transactions.store');
             
                 

        });

         
/*
|--------------------------------------------------------------------------
| PWD Routes
|--------------------------------------------------------------------------
*/


Route::middleware(['auth','can:pwd'])->group(function(){
    Route::get('/pwd/dashboard', [PWDDashboardController::class,'index'])
         ->name('pwd.dashboard');

         Route::get('/pwd/bnpc-purchases', [PWDBnpcController::class, 'index'])
         ->name('pwd.bnpc-purchases.index');

    Route::get('/pwd/medicine-purchases', function () {
            // sample empty array for now
            $mpEntries = [];
        
            return Inertia::render('PWD/MedicinePurchase', [
                'mpEntries' => $mpEntries,
            ]);
        })->name('pwd.medicine-purchases.index');

            // Barcode generation
            Route::get('/pwd/card', [PWDUserBarcodeController::class, 'generate'])
    ->name('pwd.pwd-users.dashboard.generate');
});



/*
|--------------------------------------------------------------------------
| Admin-Protected Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'can:admin'])->group(function () {

// Correct GET route for showing form with props
Route::get('/admin/register', [PWDRegistrationController::class, 'create'])
     ->name('pwd.register');

// POST route for submitting form
Route::post('/admin/register', [PWDRegistrationController::class, 'store']);
Route::post('/admin/check-duplicates', [\App\Http\Controllers\PWDRegistrationController::class, 'checkDuplicates'])
    ->name('pwd.check-duplicates');



    // Lookup PWD user by PWD number
    Route::get('/pwdusers', function (Request $request) {
        $pwdNumber = trim($request->input('pwdNumber'));
        $user = PWDRegistration::with('user')
            ->whereRaw('LOWER(pwdNumber) = ?', [strtolower($pwdNumber)])
            ->first();
        return response()->json(['user' => $user]);
    })->name('pwd.users.get');

    Route::get('/Admin/scan', function () {
     return Inertia::render('Admin/Scan');
 })->name('pwd.scan'); // ✅ now correct



    // PWD user CRUD
    Route::get('/Admin/PWDusers', [PWDUserController::class, 'index'])
         ->name('pwd.pwd-users.index');
    Route::put('/Admin/PWDusers/{id}', [PWDUserController::class, 'update'])
         ->name('pwd.pwd-users.update');

    // Barcode generation
    Route::get('/Admin/PWDusers/{id}/generate', [PWDBarcodeController::class, 'generate'])
         ->name('pwd.pwd-users.generate');

    // Admin controls
    Route::get('/Admin/controls', [AdminControlController::class, 'index'])
         ->name('admin.controls.index');
    Route::put('/Admin/controls', [AdminControlController::class, 'update'])
         ->name('admin.controls.update');
         Route::get('/Admin/bnpc', [AdminBnpcItemController::class, 'index'])
         ->name('admin.bnpc.index');
    Route::post('/Admin/bnpc', [AdminBnpcItemController::class, 'store'])
         ->name('admin.bnpc.store');
    Route::put('/Admin/bnpc/{id}', [AdminBnpcItemController::class, 'update'])
         ->name('admin.bnpc.update');
    Route::delete('/Admin/bnpc/{id}', [AdminBnpcItemController::class, 'destroy'])
         ->name('admin.bnpc.destroy');    
     Route::post('/admin/disability', [AdminDisabilityController::class, 'store'])->name('admin.disability.store');
     Route::put('/admin/disability/{disability}', [AdminDisabilityController::class, 'update'])->name('admin.disability.update');
     Route::delete('/admin/disability/{disability}', [AdminDisabilityController::class, 'destroy'])->name('admin.disability.destroy');

    // Admin dashboard
    Route::get('/admin/dashboard', [AdminDashboardController::class, 'index'])
         ->name('admin.dashboard');
});

require __DIR__.'/auth.php';
