<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProfileController extends Controller
{
    /**
     * Update the authenticated user's profile/goal fields.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'weight_kg' => ['nullable', 'numeric', 'min:1'],
            'height_cm' => ['nullable', 'numeric', 'min:1'],
            'age' => ['nullable', 'integer', 'min:1', 'max:120'],
            'gender' => ['nullable', 'in:male,female'],
            'activity_level' => ['nullable', 'in:sedentary,light,moderate,active,very_active'],
            'goal' => ['nullable', 'in:lose_weight,maintain,gain_weight'],
            'daily_calorie_goal' => ['nullable', 'integer', 'min:0'],
            'daily_protein_g_goal' => ['nullable', 'integer', 'min:0'],
            'daily_carbs_g_goal' => ['nullable', 'integer', 'min:0'],
            'daily_fat_g_goal' => ['nullable', 'integer', 'min:0'],
            'daily_water_glasses_goal' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $user = $request->user();
        $user->update($validated);

        return response()->json($user->fresh());
    }
}
