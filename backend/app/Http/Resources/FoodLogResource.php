<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class FoodLogResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        $ratio = $this->quantity_g / $this->foodItem->serving_size_g;

        return [
            'id' => $this->id,
            'meal_type' => $this->meal_type,
            'quantity_g' => (float) $this->quantity_g,
            'logged_date' => $this->logged_date->format('Y-m-d'),
            'food_item' => [
                'id' => $this->foodItem->id,
                'name' => $this->foodItem->name,
                'brand' => $this->foodItem->brand,
            ],
            // Calories/macros scaled from the food item's per-serving values
            // to the quantity actually logged.
            'calories' => round($this->foodItem->calories * $ratio, 1),
            'protein_g' => round($this->foodItem->protein_g * $ratio, 1),
            'carbs_g' => round($this->foodItem->carbs_g * $ratio, 1),
            'fat_g' => round($this->foodItem->fat_g * $ratio, 1),
        ];
    }
}
