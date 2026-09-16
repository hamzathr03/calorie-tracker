<?php

namespace App\Http\Controllers;

use App\Http\Resources\FoodLogResource;
use App\Models\FoodLog;
use Illuminate\Http\Request;

class FoodLogController extends Controller
{
    /**
     * List the authenticated user's food logs for a given date
     * (defaults to today). Used to render "Today's meals".
     */
    public function index(Request $request)
    {
        $date = $request->query('date', now()->toDateString());

        $logs = FoodLog::with('foodItem')
            ->where('user_id', $request->user()->id)
            ->whereDate('logged_date', $date)
            ->orderBy('created_at')
            ->get();

        return FoodLogResource::collection($logs);
    }

    /**
     * Log a food item for a meal.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'food_item_id' => ['required', 'exists:food_items,id'],
            'meal_type' => ['required', 'in:breakfast,lunch,dinner,snack'],
            'quantity_g' => ['required', 'numeric', 'min:1'],
            'logged_date' => ['nullable', 'date'],
        ]);

        $log = FoodLog::create([
            'user_id' => $request->user()->id,
            'food_item_id' => $validated['food_item_id'],
            'meal_type' => $validated['meal_type'],
            'quantity_g' => $validated['quantity_g'],
            'logged_date' => $validated['logged_date'] ?? now()->toDateString(),
        ]);

        return new FoodLogResource($log->load('foodItem'));
    }

    /**
     * Remove a logged food entry (only its owner can delete it).
     */
    public function destroy(Request $request, FoodLog $foodLog)
    {
        if ($foodLog->user_id !== $request->user()->id) {
            abort(403);
        }

        $foodLog->delete();

        return response()->json(['message' => 'Supprimé avec succès.']);
    }
}
