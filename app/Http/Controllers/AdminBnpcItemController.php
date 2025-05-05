<?php

namespace App\Http\Controllers;

use App\Models\BnpcItem;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Inertia\Inertia;
use Exception;

class AdminBnpcItemController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:Basic Necessities,Prime Commodities',
        ]);

        try {
            BnpcItem::create($validated);
            return redirect()->route('admin.controls.index')
                ->with('success', 'Item created successfully.');
        } catch (Exception $e) {
            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Failed to create item. Please try again.']);
        }
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:Basic Necessities,Prime Commodities',
        ]);

        try {
            $item = BnpcItem::findOrFail($id);
            $item->update($validated);

            return redirect()->route('admin.controls.index')
                ->with('success', 'Item updated successfully.');
        } catch (ModelNotFoundException $e) {
            return redirect()->back()
                ->withErrors(['error' => 'Item not found.']);
        } catch (Exception $e) {
            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Failed to update item. Please try again.']);
        }
    }

    public function destroy($id)
    {
        try {
            $item = BnpcItem::findOrFail($id);
            $item->delete();

            return redirect()->route('admin.controls.index')
                ->with('success', 'Item deleted successfully.');
        } catch (ModelNotFoundException $e) {
            return redirect()->back()
                ->withErrors(['error' => 'Item not found.']);
        } catch (Exception $e) {
            return redirect()->back()
                ->withErrors(['error' => 'Failed to delete item. Please try again.']);
        }
    }
}
