<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable([
    'name',
    'email',
    'password',
    'weight_kg',
    'height_cm',
    'age',
    'gender',
    'activity_level',
    'goal',
    'daily_calorie_goal',
    'daily_protein_g_goal',
    'daily_carbs_g_goal',
    'daily_fat_g_goal',
    'daily_water_glasses_goal',
])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'weight_kg' => 'decimal:2',
            'height_cm' => 'decimal:2',
        ];
    }

    /**
     * All diary entries (food logged) belonging to this user.
     */
    public function foodLogs(): HasMany
    {
        return $this->hasMany(FoodLog::class);
    }

    /**
     * Daily water intake entries belonging to this user.
     */
    public function waterLogs(): HasMany
    {
        return $this->hasMany(WaterLog::class);
    }
}
