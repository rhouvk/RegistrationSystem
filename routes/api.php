<?php
// routes/api.php or in a controller closure
use App\Models\PWDRegistration;
use Illuminate\Http\Request;

Route::get('/pwdusers', function (Request $request) {
    $pwdNumber = $request->input('pwdNumber');
    $user = PWDRegistration::whereRaw('LOWER(pwdNumber) = ?', [strtolower(trim($pwdNumber))])->first();
    return response()->json(['user' => $user]);
});