<?php

namespace App\Http\Controllers;

use App\Models\AdminControl;
use App\Models\BnpcItem;

use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminControlController extends Controller
{
    /**
     * Display the admin controls.
     */
    public function index()
    {
        $control        = AdminControl::first();
        $bnpcItems      = BnpcItem::orderBy('type')->orderBy('name')->get();
        $disabilityItems = \App\Models\DisabilityList::orderBy('category')->orderBy('name')->get();
    
        return Inertia::render('Admin/AdminControls', [
            'control'         => $control,
            'bnpcItems'       => $bnpcItems,
            'disabilityItems' => $disabilityItems,
        ]);
    }

    /**
     * Update the admin controls.
     */
    public function update(Request $request)
    {
        // Validate incoming data
        $validatedData = $request->validate([
            'purchaseLimit'  => 'required|integer',
            'cardExpiration' => 'required|integer',
        ]);

        // Retrieve the first (and only) admin control record
        $control = AdminControl::first();
        $control->update($validatedData);

        return redirect()->back()->with('success', 'Admin controls updated successfully!');
    }
}
