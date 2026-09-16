<?php

namespace App\Http\Controllers;

use App\Models\FoodLog;
use App\Models\WaterLog;
use Illuminate\Http\Request;

class SummaryController extends Controller
{
    /**
     * Aggregate calories/macros/water for a given day (defaults to today)
     * against the user's daily goals. This is what powers the dashboard's
     * summary cards (Calories remaining, Protein, Carbs, Water).
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $date = $request->query('date', now()->toDateString());

        $logs = FoodLog::with('foodItem')
            ->where('user_id', $user->id)
            ->whereDate('logged_date', $date)
            ->get();

        $totals = ['calories' => 0, 'protein_g' => 0, 'carbs_g' => 0, 'fat_g' => 0];

        foreach ($logs as $log) {
            $ratio = $log->quantity_g / $log->foodItem->serving_size_g;
            $totals['calories'] += $log->foodItem->calories * $ratio;
            $totals['protein_g'] += $log->foodItem->protein_g * $ratio;
            $totals['carbs_g'] += $log->foodItem->carbs_g * $ratio;
            $totals['fat_g'] += $log->foodItem->fat_g * $ratio;
        }

        $water = WaterLog::where('user_id', $user->id)
            ->whereDate('logged_date', $date)
            ->first();

        return response()->json([
            'date' => $date,
            'calories' => [
                'goal' => $user->daily_calorie_goal,
                'consumed' => round($totals['calories'], 1),
                'remaining' => $user->daily_calorie_goal !== null
                    ? round($user->daily_calorie_goal - $totals['calories'], 1)
                    : null,
            ],
            'protein_g' => [
                'goal' => $user->daily_protein_g_goal,
                'consumed' => round($totals['protein_g'], 1),
            ],
            'carbs_g' => [
                'goal' => $user->daily_carbs_g_goal,
                'consumed' => round($totals['carbs_g'], 1),
            ],
            'fat_g' => [
                'goal' => $user->daily_fat_g_goal,
                'consumed' => round($totals['fat_g'], 1),
            ],
            'water' => [
                'goal' => $user->daily_water_glasses_goal,
                'glasses' => $water->glasses ?? 0,
            ],
        ]);
    }

    /**
     * Daily calorie/macro totals for the last N days (default 7), used by
     * the Progress page's chart.
     */
    public function history(Request $request)
    {
        $user = $request->user();
        $days = max(1, min(30, (int) $request->query('days', 7)));

        $startDate = now()->subDays($days - 1)->toDateString();
        $endDate = now()->toDateString();

        $logsByDate = FoodLog::with('foodItem')
            ->where('user_id', $user->id)
            ->whereBetween('logged_date', [$startDate, $endDate])
            ->get()
            ->groupBy(fn ($log) => $log->logged_date->format('Y-m-d'));

        $history = [];

        for ($i = $days - 1; $i >= 0; $i--) {
            $date = now()->subDays($i)->toDateString();
            $dayLogs = $logsByDate->get($date, collect());

            $totals = ['calories' => 0, 'protein_g' => 0, 'carbs_g' => 0, 'fat_g' => 0];

            foreach ($dayLogs as $log) {
                $ratio = $log->quantity_g / $log->foodItem->serving_size_g;
                $totals['calories'] += $log->foodItem->calories * $ratio;
                $totals['protein_g'] += $log->foodItem->protein_g * $ratio;
                $totals['carbs_g'] += $log->foodItem->carbs_g * $ratio;
                $totals['fat_g'] += $log->foodItem->fat_g * $ratio;
            }

            $history[] = [
                'date' => $date,
                'calories' => round($totals['calories'], 1),
                'protein_g' => round($totals['protein_g'], 1),
                'carbs_g' => round($totals['carbs_g'], 1),
                'fat_g' => round($totals['fat_g'], 1),
            ];
        }

        return response()->json([
            'days' => $days,
            'calorie_goal' => $user->daily_calorie_goal,
            'history' => $history,
        ]);
    }
}
