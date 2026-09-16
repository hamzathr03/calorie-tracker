import { useEffect, useState, useCallback } from "react";
import { Bell, Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../lib/api";
import AddFoodModal from "../components/AddFoodModal";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function getTodayLabel() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const MEAL_TYPES = [
  { key: "breakfast", label: "Breakfast", icon: "☕" },
  { key: "lunch", label: "Lunch", icon: "🥗" },
  { key: "dinner", label: "Dinner", icon: "🍽️" },
  { key: "snack", label: "Snack", icon: "🍎" },
];

export default function Dashboard() {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] || "there";

  const [summary, setSummary] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMealType, setModalMealType] = useState("breakfast");
  const [addingWater, setAddingWater] = useState(false);

  const loadData = useCallback(() => {
    setLoading(true);
    return Promise.all([apiFetch("/summary"), apiFetch("/food-logs")])
      .then(([summaryData, logsData]) => {
        setSummary(summaryData);
        setLogs(logsData.data ?? []);
        setError("");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleAddWater = async () => {
    setAddingWater(true);
    try {
      await apiFetch("/water-logs", {
        method: "PUT",
        body: JSON.stringify({ glasses: summary.water.glasses + 1 }),
      });
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setAddingWater(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openAddFood = (mealType) => {
    setModalMealType(mealType);
    setModalOpen(true);
  };

  const handleFoodAdded = () => {
    setModalOpen(false);
    loadData();
  };

  if (loading) {
    return (
      <div className="topbar">
        <p>Chargement de ton dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="topbar">
        <p>Erreur: {error}</p>
      </div>
    );
  }

  const mealsByType = { breakfast: [], lunch: [], dinner: [], snack: [] };
  logs.forEach((log) => {
    mealsByType[log.meal_type]?.push(log);
  });

  const calorieGoal = summary.calories.goal;
  const calorieConsumed = summary.calories.consumed;
  const caloriePercent = calorieGoal
    ? Math.min(100, Math.round((calorieConsumed / calorieGoal) * 100))
    : null;

  const macroBar = (goal, consumed) =>
    goal ? Math.min(100, Math.round((consumed / goal) * 100)) : 0;

  return (
    <>
      <header className="topbar">
        <div>
          <p className="date">{getTodayLabel()}</p>
          <h1>{getGreeting()}, {firstName} 👋</h1>
        </div>

        <button className="notification">
          <Bell size={20} />
        </button>
      </header>

      <section className="summary-grid">
        <div className="calorie-card">
          <div>
            <p>Calories remaining</p>
            {calorieGoal ? (
              <>
                <h2>{summary.calories.remaining} <small>kcal</small></h2>
                <span className="positive">{calorieConsumed} kcal consumed</span>
              </>
            ) : (
              <>
                <h2>{calorieConsumed} <small>kcal</small></h2>
                <span className="positive">Set a calorie goal to see remaining</span>
              </>
            )}
          </div>

          {calorieGoal && (
            <div className="progress-ring">
              <strong>{caloriePercent}%</strong>
              <span>used</span>
            </div>
          )}
        </div>

        <div className="stat-card">
          <span className="stat-label">Protein</span>
          <strong>
            {summary.protein_g.consumed}g{" "}
            {summary.protein_g.goal && <small>/ {summary.protein_g.goal}g</small>}
          </strong>
          <div className="bar">
            <div
              className="bar-fill protein"
              style={{ width: `${macroBar(summary.protein_g.goal, summary.protein_g.consumed)}%` }}
            ></div>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-label">Carbs</span>
          <strong>
            {summary.carbs_g.consumed}g{" "}
            {summary.carbs_g.goal && <small>/ {summary.carbs_g.goal}g</small>}
          </strong>
          <div className="bar">
            <div
              className="bar-fill carbs"
              style={{ width: `${macroBar(summary.carbs_g.goal, summary.carbs_g.consumed)}%` }}
            ></div>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-label">Water</span>
          <strong>
            {summary.water.glasses} <small>/ {summary.water.goal} glasses</small>
          </strong>
          <div className="bar">
            <div
              className="bar-fill water"
              style={{ width: `${macroBar(summary.water.goal, summary.water.glasses)}%` }}
            ></div>
          </div>
          <button
            className="small-add"
            style={{ marginTop: 10 }}
            onClick={handleAddWater}
            disabled={addingWater}
          >
            {addingWater ? "..." : "+ Add glass"}
          </button>
        </div>
      </section>

      <section className="content-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h2>Today's meals</h2>
              <p>Track your food throughout the day</p>
            </div>

            <button className="add-button" onClick={() => openAddFood("breakfast")}>
              <Plus size={18} />
              Add food
            </button>
          </div>

          {MEAL_TYPES.map(({ key, label, icon }) => {
            const entries = mealsByType[key];
            const totalCalories = entries.reduce((sum, e) => sum + e.calories, 0);

            return (
              <div className={`meal ${entries.length === 0 ? "empty-meal" : ""}`} key={key}>
                <div className={`meal-icon ${key}`}>{icon}</div>
                <div className="meal-info">
                  <strong>{label}</strong>
                  <span>
                    {entries.length > 0
                      ? `${entries.length} item${entries.length > 1 ? "s" : ""} added`
                      : "No food added yet"}
                  </span>
                </div>
                {entries.length > 0 ? (
                  <b>{Math.round(totalCalories)} kcal</b>
                ) : (
                  <button className="small-add" onClick={() => openAddFood(key)}>
                    Add
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="panel tip-panel">
          <span className="tip-icon">💡</span>
          <h2>Daily tip</h2>
          <p>
            Drink water before meals. It can help you stay hydrated and
            support better eating habits.
          </p>
          <button className="learn-button">Learn more</button>
        </div>
      </section>

      <AddFoodModal
        isOpen={modalOpen}
        defaultMealType={modalMealType}
        onClose={() => setModalOpen(false)}
        onAdded={handleFoodAdded}
      />
    </>
  );
}
