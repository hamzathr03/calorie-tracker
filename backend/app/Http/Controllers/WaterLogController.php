<?php

namespace App\Http\Controllers;

use App\Models\WaterLog;
use Illuminate\Http\Request;

class WaterLogController extends Controller
{
    /**
     * Get (or create) the water log entry for a given day (defaults to
     * today).
     */
    public function show(Request $request)
    {
        $date = $request->query('date', now()->toDateString());

        $log = WaterLog::firstOrCreate(
            ['user_id' => $request->user()->id, 'logged_date' => $date],
            ['glasses' => 0]
        );

        return response()->json($log);
    }

    /**
     * Set the number of glasses drunk for a given day. The frontend sends
     * the new total (e.g. current + 1), so incrementing/decrementing is
     * handled client-side.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'glasses' => ['required', 'integer', 'min:0', 'max:50'],
            'logged_date' => ['nullable', 'date'],
        ]);

        $date = $validated['logged_date'] ?? now()->toDateString();

        $log = WaterLog::updateOrCreate(
            ['user_id' => $request->user()->id, 'logged_date' => $date],
            ['glasses' => $validated['glasses']]
        );

        return response()->json($log);
    }
}
