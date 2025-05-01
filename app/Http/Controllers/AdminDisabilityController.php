<?php

namespace App\Http\Controllers;

use App\Models\DisabilityList;
use Illuminate\Http\Request;

class AdminDisabilityController extends Controller
{
    public function store(Request $request)
    {
        $validated = $this->validateDisability($request);

        DisabilityList::create($validated);

        return to_route('admin.controls.index')->with('success', 'Disability item created.');
    }

    public function update(Request $request, DisabilityList $disability)
    {
        $validated = $this->validateDisability($request);

        $disability->update($validated);

        return to_route('admin.controls.index')->with('success', 'Disability item updated.');
    }

    public function destroy(DisabilityList $disability)
    {
        $disability->delete();

        return to_route('admin.controls.index')->with('success', 'Disability item deleted.');
    }

    private function validateDisability(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'in:Type,Cause'],
        ]);
    }
}
