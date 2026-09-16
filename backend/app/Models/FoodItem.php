<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'created_by',
    'name',
    'brand',
    'serving_size_g',
    'calories',
    'protein_g',
    'carbs_g',
    'fat_g',
])]
class FoodItem extends Model
{
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'serving_size_g' => 'decimal:2',
            'protein_g' => 'decimal:1',
            'carbs_g' => 'decimal:1',
            'fat_g' => 'decimal:1',
        ];
    }

    /**
     * The user who added this food item to the catalog (nullable — some
     * items can be seeded/global rather than user-created).
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * All diary entries that reference this food item.
     */
    public function foodLogs(): HasMany
    {
        return $this->hasMany(FoodLog::class);
    }
}
