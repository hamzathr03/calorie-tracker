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
        Schema::create('food_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('name');
            $table->string('brand')->nullable();
            $table->decimal('serving_size_g', 6, 2)->default(100);
            $table->unsignedSmallInteger('calories');
            $table->decimal('protein_g', 5, 1)->default(0);
            $table->decimal('carbs_g', 5, 1)->default(0);
            $table->decimal('fat_g', 5, 1)->default(0);
            $table->timestamps();

            $table->index('name');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('food_items');
    }
};
