<?php
namespace App\Http\Controllers;

use App\Models\BnpcItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminBnpcItemController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:Basic Necessities,Prime Commodities',
        ]);

        BnpcItem::create($validated);

        // Redirect back to the AdminControls page so Inertia can re-fetch props
        return redirect()->route('admin.controls.index')
            ->with('success', 'Item created.');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:Basic Necessities,Prime Commodities',
        ]);

        BnpcItem::findOrFail($id)->update($validated);

        return redirect()->route('admin.controls.index')
            ->with('success', 'Item updated.');
    }

    public function destroy($id)
    {
        BnpcItem::destroy($id);

        return redirect()->route('admin.controls.index')
            ->with('success', 'Item deleted.');
    }
}
