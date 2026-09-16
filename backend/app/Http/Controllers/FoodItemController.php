<?php

namespace App\Http\Controllers;

use App\Models\FoodItem;
use Illuminate\Http\Request;

class FoodItemController extends Controller
{
    /**
     * List food items, optionally filtered by a search term
     * (used by the frontend's "add food" search box).
     */
    public function index(Request $request)
    {
        $query = FoodItem::query();

        if ($search = $request->query('search')) {
            $query->where('name', 'like', "%{$search}%");
        }

        return response()->json(
            $query->orderBy('name')->limit(50)->get()
        );
    }

    /**
     * Create a new food item (e.g. a custom food the user wants to log
     * that isn't in the catalog yet).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'brand' => ['nullable', 'string', 'max:255'],
            'serving_size_g' => ['required', 'numeric', 'min:1'],
            'calories' => ['required', 'numeric', 'min:0'],
            'protein_g' => ['required', 'numeric', 'min:0'],
            'carbs_g' => ['required', 'numeric', 'min:0'],
            'fat_g' => ['required', 'numeric', 'min:0'],
        ]);

        $foodItem = FoodItem::create([
            ...$validated,
            'created_by' => $request->user()->id,
        ]);

        return response()->json($foodItem, 201);
    }
}
