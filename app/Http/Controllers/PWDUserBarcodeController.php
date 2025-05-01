<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use TCPDF2DBarcode;
use App\Models\PWDRegistration;
use Vinkla\Hashids\Facades\Hashids;

class PWDUserBarcodeController extends Controller
{
    public function generate(Request $request)
    {
        $user = $request->user();
        $pwd = PWDRegistration::with(['disabilityType', 'municipality'])->where('user_id', $user->id)->first();

        if (!$pwd) {
            return response('PWD record not found', 404);
        }

        
        $hashid = Hashids::encode($pwd->id); // Short hash for barcode
        $barcode = new TCPDF2DBarcode($hashid, 'PDF417,,6');
        $barcodeImage = imagecreatefromstring($barcode->getBarcodePngData(4.51, 1.70)); // <== This was missing
        

        // Load template
        $bgPath = public_path('images/blank.png');
        if (!file_exists($bgPath)) return response('Background template not found.', 500);
        $bg = imagecreatefrompng($bgPath);
        $canvas = imagecreatetruecolor(imagesx($bg), imagesy($bg));
        imagecopy($canvas, $bg, 0, 0, 0, 0, imagesx($bg), imagesy($bg));

        // Photo
        $photoPath = $pwd->photo ? public_path('storage/' . $pwd->photo) : public_path('images/person.png');
        if (file_exists($photoPath)) {
            $ext = strtolower(pathinfo($photoPath, PATHINFO_EXTENSION));
            $photo = $ext === 'png' ? imagecreatefrompng($photoPath) : imagecreatefromjpeg($photoPath);
            $resized = imagecreatetruecolor(250, 250);
            imagecopyresampled($resized, $photo, 0, 0, 0, 0, 250, 250, imagesx($photo), imagesy($photo));
            imagecopy($canvas, $resized, 698, 159, 0, 0, 250, 250);
        }

        // Signature
        $sigPath = $pwd->signature ? public_path('storage/' . $pwd->signature) : public_path('images/signature.png');
        if (file_exists($sigPath)) {
            $ext = strtolower(pathinfo($sigPath, PATHINFO_EXTENSION));
            $sig = $ext === 'png' ? imagecreatefrompng($sigPath) : imagecreatefromjpeg($sigPath);
            $sigW = imagesx($sig);
            $sigH = imagesy($sig);
            $newH = 40;
            $newW = intval($sigW * ($newH / $sigH));
            $sigResized = imagecreatetruecolor($newW, $newH);
            imagealphablending($sigResized, false);
            imagesavealpha($sigResized, true);
            imagefill($sigResized, 0, 0, imagecolorallocatealpha($sigResized, 0, 0, 0, 127));
            imagecopyresampled($sigResized, $sig, 0, 0, 0, 0, $newW, $newH, $sigW, $sigH);
            imagecopy($canvas, $sigResized, 230, 370, 0, 0, $newW, $newH);
        }

        // Barcode
        imagecopy($canvas, $barcodeImage, 6, imagesy($bg) - imagesy($barcodeImage) - 10 , 0, 0, imagesx($barcodeImage), imagesy($barcodeImage));

        // Font
        $fontPath = public_path('fonts/OpenSans-Regular.ttf');
        if (!file_exists($fontPath)) return response('Font file missing', 500);

        $black = imagecolorallocate($canvas, 0, 0, 0);
        $fs = 15;

        imagettftext($canvas, $fs, 0, 305, 191, $black, $fontPath, strtoupper(optional($pwd->municipality)->name ?? 'DAVAO'));
        imagettftext($canvas, $fs, 0, 144, 244, $black, $fontPath, strtoupper($user->name));
        imagettftext($canvas, $fs, 0, 270, 297, $black, $fontPath, strtoupper(optional($pwd->disabilityType)->name));
        imagettftext($canvas, $fs, 0, 144, 350, $black, $fontPath, strtoupper($pwd->pwdNumber));

        // Return image
        ob_start();
        imagepng($canvas);
        $image = ob_get_clean();
        imagedestroy($canvas);
        imagedestroy($bg);

        return response($image)->header('Content-Type', 'image/png');
    }
}
