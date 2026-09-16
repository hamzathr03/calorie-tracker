<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FoodItemController;
use App\Http\Controllers\FoodLogController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SummaryController;
use App\Http\Controllers\WaterLogController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/profile', [ProfileController::class, 'update']);

    Route::get('/food-items', [FoodItemController::class, 'index']);
    Route::post('/food-items', [FoodItemController::class, 'store']);

    Route::get('/food-logs', [FoodLogController::class, 'index']);
    Route::post('/food-logs', [FoodLogController::class, 'store']);
    Route::delete('/food-logs/{foodLog}', [FoodLogController::class, 'destroy']);

    Route::get('/water-logs', [WaterLogController::class, 'show']);
    Route::put('/water-logs', [WaterLogController::class, 'update']);

    Route::get('/summary', [SummaryController::class, 'index']);
    Route::get('/summary/history', [SummaryController::class, 'history']);
});
