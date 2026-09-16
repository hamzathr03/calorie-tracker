import { useEffect, useState } from "react";
import { Flame, Beef, Wheat, Droplet, GlassWater, Sparkles, Weight, Ruler, Calendar } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../lib/api";
import { calculateSuggestedGoals } from "../lib/nutritionCalculator";
import "../LoginPage.css";
import "./Goals.css";

const PROFILE_NUMBER_FIELDS = [
  { key: "weight_kg", label: "Poids", unit: "kg", icon: Weight, iconClass: "weight", placeholder: "72" },
  { key: "height_cm", label: "Taille", unit: "cm", icon: Ruler, iconClass: "height", placeholder: "175" },
  { key: "age", label: "Âge", unit: "ans", icon: Calendar, iconClass: "age", placeholder: "24" },
];

const GOAL_FIELDS = [
  { key: "daily_calorie_goal", label: "Calories", unit: "kcal / jour", icon: Flame, iconClass: "calories", placeholder: "2000" },
  { key: "daily_protein_g_goal", label: "Protéines", unit: "g / jour", icon: Beef, iconClass: "protein", placeholder: "140" },
  { key: "daily_carbs_g_goal", label: "Glucides", unit: "g / jour", icon: Wheat, iconClass: "carbs", placeholder: "220" },
  { key: "daily_fat_g_goal", label: "Lipides", unit: "g / jour", icon: Droplet, iconClass: "fat", placeholder: "70" },
  { key: "daily_water_glasses_goal", label: "Eau", unit: "verres / jour", icon: GlassWater, iconClass: "water", placeholder: "8" },
];

const EMPTY_FORM = {
  weight_kg: "",
  height_cm: "",
  age: "",
  gender: "male",
  activity_level: "moderate",
  goal: "maintain",
  daily_calorie_goal: "",
  daily_protein_g_goal: "",
  daily_carbs_g_goal: "",
  daily_fat_g_goal: "",
  daily_water_glasses_goal: 8,
};

export default function Goals() {
  const { user, refreshUser } = useAuth();

  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        weight_kg: user.weight_kg ?? "",
        height_cm: user.height_cm ?? "",
        age: user.age ?? "",
        gender: user.gender ?? "male",
        activity_level: user.activity_level ?? "moderate",
        goal: user.goal ?? "maintain",
        daily_calorie_goal: user.daily_calorie_goal ?? "",
        daily_protein_g_goal: user.daily_protein_g_goal ?? "",
        daily_carbs_g_goal: user.daily_carbs_g_goal ?? "",
        daily_fat_g_goal: user.daily_fat_g_goal ?? "",
        daily_water_glasses_goal: user.daily_water_glasses_goal ?? 8,
      });
    }
  }, [user]);

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setSuccess(false);
  };

  const canCalculate = form.weight_kg && form.height_cm && form.age;

  const handleCalculate = () => {
    const suggested = calculateSuggestedGoals({
      weightKg: form.weight_kg,
      heightCm: form.height_cm,
      age: form.age,
      gender: form.gender,
      activityLevel: form.activity_level,
      goal: form.goal,
    });

    setForm((f) => ({ ...f, ...suggested }));
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      await apiFetch("/profile", {
        method: "PUT",
        body: JSON.stringify({
          weight_kg: form.weight_kg || null,
          height_cm: form.height_cm || null,
          age: form.age || null,
          gender: form.gender || null,
          activity_level: form.activity_level || null,
          goal: form.goal || null,
          daily_calorie_goal: form.daily_calorie_goal || null,
          daily_protein_g_goal: form.daily_protein_g_goal || null,
          daily_carbs_g_goal: form.daily_carbs_g_goal || null,
          daily_fat_g_goal: form.daily_fat_g_goal || null,
          daily_water_glasses_goal: form.daily_water_glasses_goal || 8,
        }),
      });
      await refreshUser();
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="content-grid" style={{ gridTemplateColumns: "1fr" }}>
      <div className="panel">
        <h2>Goals</h2>
        <p className="goals-intro">
          Renseigne ton profil pour calculer tes objectifs, ou saisis-les toi-même plus bas.
        </p>

        {error && <div className="login-alert login-alert-error">{error}</div>}
        {success && (
          <div className="login-alert login-alert-success">
            Objectifs enregistrés avec succès !
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <h3 className="goals-section-title">Ton profil</h3>

          <div className="profile-grid">
            {PROFILE_NUMBER_FIELDS.map(({ key, label, unit, icon: Icon, iconClass, placeholder }) => (
              <div className="goal-field" key={key}>
                <div className={`goal-field-icon ${iconClass}`}>
                  <Icon size={19} />
                </div>
                <div className="goal-field-body">
                  <label htmlFor={key}>{label}</label>
                  <input
                    id={key}
                    type="number"
                    min="1"
                    placeholder={placeholder}
                    value={form[key]}
                    onChange={handleChange(key)}
                  />
                </div>
                <span className="goal-field-unit">{unit}</span>
              </div>
            ))}
          </div>

          <div className="profile-select-grid">
            <div className="login-field">
              <label htmlFor="gender">Genre</label>
              <select id="gender" value={form.gender} onChange={handleChange("gender")}>
                <option value="male">Homme</option>
                <option value="female">Femme</option>
              </select>
            </div>

            <div className="login-field">
              <label htmlFor="activity_level">Niveau d'activité</label>
              <select
                id="activity_level"
                value={form.activity_level}
                onChange={handleChange("activity_level")}
              >
                <option value="sedentary">Sédentaire (peu ou pas de sport)</option>
                <option value="light">Légèrement actif (1-3j/semaine)</option>
                <option value="moderate">Modérément actif (3-5j/semaine)</option>
                <option value="active">Actif (6-7j/semaine)</option>
                <option value="very_active">Très actif (sport intense)</option>
              </select>
            </div>

            <div className="login-field">
              <label htmlFor="goal">Objectif</label>
              <select id="goal" value={form.goal} onChange={handleChange("goal")}>
                <option value="lose_weight">Perdre du poids</option>
                <option value="maintain">Maintenir mon poids</option>
                <option value="gain_weight">Prendre du poids</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            className="calculate-button"
            onClick={handleCalculate}
            disabled={!canCalculate}
          >
            <Sparkles size={16} />
            Calculer mes objectifs
          </button>

          <h3 className="goals-section-title">Tes objectifs quotidiens</h3>

          <div className="goals-grid">
            {GOAL_FIELDS.map(({ key, label, unit, icon: Icon, iconClass, placeholder }) => (
              <div className="goal-field" key={key}>
                <div className={`goal-field-icon ${iconClass}`}>
                  <Icon size={19} />
                </div>
                <div className="goal-field-body">
                  <label htmlFor={key}>{label}</label>
                  <input
                    id={key}
                    type="number"
                    min="0"
                    placeholder={placeholder}
                    value={form[key]}
                    onChange={handleChange(key)}
                  />
                </div>
                <span className="goal-field-unit">{unit}</span>
              </div>
            ))}
          </div>

          <button type="submit" className="login-submit goals-save" disabled={saving}>
            {saving ? "Enregistrement..." : "Save goals"}
          </button>
        </form>
      </div>
    </div>
  );
}
