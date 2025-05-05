<?php

namespace App\Http\Controllers;

use App\Models\AdminControl;
use App\Models\BnpcItem;
use App\Models\DisabilityList;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Exception;

class AdminControlController extends Controller
{
    /**
     * Display the admin controls.
     */
    public function index()
    {
        try {
            $control         = AdminControl::first();
            $bnpcItems       = BnpcItem::orderBy('type')->orderBy('name')->get();
            $disabilityItems = DisabilityList::orderBy('category')->orderBy('name')->get();

            return Inertia::render('Admin/AdminControls', [
                'control'         => $control,
                'bnpcItems'       => $bnpcItems,
                'disabilityItems' => $disabilityItems,
            ]);
        } catch (Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to load admin controls. Please try again.']);
        }
    }

    /**
     * Update the admin controls.
     */
    public function update(Request $request)
    {
        $validatedData = $request->validate([
            'purchaseLimit'  => 'required|integer',
            'cardExpiration' => 'required|integer',
        ]);

        try {
            $control = AdminControl::first();

            if (!$control) {
                return redirect()->back()->withErrors(['error' => 'Admin control record not found.']);
            }

            $control->update($validatedData);

            return redirect()->back()->with('success', 'Admin controls updated successfully!');
        } catch (Exception $e) {
            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Failed to update admin controls. Please try again.']);
        }
    }
}
