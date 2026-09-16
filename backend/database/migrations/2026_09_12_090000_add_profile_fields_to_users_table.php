<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Basic bio info (useful later to auto-suggest calorie goals)
            $table->decimal('weight_kg', 5, 2)->nullable()->after('password');
            $table->decimal('height_cm', 5, 2)->nullable()->after('weight_kg');
            $table->unsignedTinyInteger('age')->nullable()->after('height_cm');
            $table->enum('gender', ['male', 'female'])->nullable()->after('age');
            $table->enum('activity_level', ['sedentary', 'light', 'moderate', 'active', 'very_active'])
                ->default('moderate')
                ->after('gender');

            // Daily targets shown on the dashboard (Calories remaining, Protein, Carbs, Water)
            $table->unsignedInteger('daily_calorie_goal')->nullable()->after('activity_level');
            $table->unsignedInteger('daily_protein_g_goal')->nullable()->after('daily_calorie_goal');
            $table->unsignedInteger('daily_carbs_g_goal')->nullable()->after('daily_protein_g_goal');
            $table->unsignedInteger('daily_fat_g_goal')->nullable()->after('daily_carbs_g_goal');
            $table->unsignedTinyInteger('daily_water_glasses_goal')->default(8)->after('daily_fat_g_goal');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'weight_kg',
                'height_cm',
                'age',
                'gender',
                'activity_level',
                'daily_calorie_goal',
                'daily_protein_g_goal',
                'daily_carbs_g_goal',
                'daily_fat_g_goal',
                'daily_water_glasses_goal',
            ]);
        });
    }
};
