<?php

namespace Database\Seeders;

use App\Models\FoodItem;
use Illuminate\Database\Seeder;

class FoodItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $items = [
            ['name' => 'Chicken breast (cooked)', 'serving_size_g' => 100, 'calories' => 165, 'protein_g' => 31, 'carbs_g' => 0, 'fat_g' => 3.6],
            ['name' => 'White rice (cooked)', 'serving_size_g' => 100, 'calories' => 130, 'protein_g' => 2.7, 'carbs_g' => 28, 'fat_g' => 0.3],
            ['name' => 'Egg', 'serving_size_g' => 50, 'calories' => 78, 'protein_g' => 6.3, 'carbs_g' => 0.6, 'fat_g' => 5.3],
            ['name' => 'Banana', 'serving_size_g' => 118, 'calories' => 105, 'protein_g' => 1.3, 'carbs_g' => 27, 'fat_g' => 0.4],
            ['name' => 'Whole milk', 'serving_size_g' => 244, 'calories' => 149, 'protein_g' => 7.7, 'carbs_g' => 12, 'fat_g' => 8],
            ['name' => 'Bread (white)', 'serving_size_g' => 30, 'calories' => 79, 'protein_g' => 2.7, 'carbs_g' => 15, 'fat_g' => 1],
            ['name' => 'Olive oil', 'serving_size_g' => 14, 'calories' => 119, 'protein_g' => 0, 'carbs_g' => 0, 'fat_g' => 13.5],
            ['name' => 'Greek yogurt (plain)', 'serving_size_g' => 170, 'calories' => 100, 'protein_g' => 17, 'carbs_g' => 6, 'fat_g' => 0.7],
            ['name' => 'Almonds', 'serving_size_g' => 28, 'calories' => 164, 'protein_g' => 6, 'carbs_g' => 6, 'fat_g' => 14],
            ['name' => 'Apple', 'serving_size_g' => 182, 'calories' => 95, 'protein_g' => 0.5, 'carbs_g' => 25, 'fat_g' => 0.3],
        ];

        foreach ($items as $item) {
            FoodItem::create($item);
        }
    }
}
