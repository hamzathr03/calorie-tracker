const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const GOAL_ADJUSTMENTS = {
  lose_weight: -500,
  maintain: 0,
  gain_weight: 500,
};

/**
 * Estimate daily calorie/macro targets from basic profile info, using the
 * Mifflin-St Jeor formula for BMR. This is a common, general-purpose
 * estimate — not medical advice.
 */
export function calculateSuggestedGoals({
  weightKg,
  heightCm,
  age,
  gender,
  activityLevel,
  goal,
}) {
  const weight = Number(weightKg);
  const height = Number(heightCm);
  const years = Number(age);

  const bmr =
    gender === "female"
      ? 10 * weight + 6.25 * height - 5 * years - 161
      : 10 * weight + 6.25 * height - 5 * years + 5;

  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] ?? 1.2;
  const tdee = bmr * multiplier;

  const adjustment = GOAL_ADJUSTMENTS[goal] ?? 0;
  const calorieGoal = Math.round(tdee + adjustment);

  // Protein and fat scaled to bodyweight; carbs fill the remaining calories.
  const proteinG = Math.round(weight * 1.8);
  const fatG = Math.round(weight * 0.8);
  const remainingCalories = Math.max(
    0,
    calorieGoal - proteinG * 4 - fatG * 9
  );
  const carbsG = Math.round(remainingCalories / 4);

  // Rough water guideline: ~35ml per kg of bodyweight, in 250ml glasses.
  const waterGlasses = Math.max(4, Math.round((weight * 35) / 250));

  return {
    daily_calorie_goal: calorieGoal,
    daily_protein_g_goal: proteinG,
    daily_carbs_g_goal: carbsG,
    daily_fat_g_goal: fatG,
    daily_water_glasses_goal: waterGlasses,
  };
}
