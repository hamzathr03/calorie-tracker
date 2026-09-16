import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import { apiFetch } from "../lib/api";
import AddFoodModal from "../components/AddFoodModal";
import "./FoodDiary.css";

const MEAL_TYPES = [
  { key: "breakfast", label: "Breakfast", icon: "☕" },
  { key: "lunch", label: "Lunch", icon: "🥗" },
  { key: "dinner", label: "Dinner", icon: "🍽️" },
  { key: "snack", label: "Snack", icon: "🍎" },
];

function toDateStr(date) {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 10);
}

function formatDateLabel(dateStr) {
  const date = new Date(`${dateStr}T00:00:00`);
  if (dateStr === toDateStr(new Date())) return "Today";
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function FoodDiary() {
  const [selectedDate, setSelectedDate] = useState(toDateStr(new Date()));
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMealType, setModalMealType] = useState("breakfast");

  const loadLogs = useCallback(() => {
    setLoading(true);
    return apiFetch(`/food-logs?date=${selectedDate}`)
      .then((res) => setLogs(res.data ?? []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedDate]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const changeDay = (delta) => {
    const d = new Date(`${selectedDate}T00:00:00`);
    d.setDate(d.getDate() + delta);
    setSelectedDate(toDateStr(d));
  };

  const handleDelete = async (id) => {
    try {
      await apiFetch(`/food-logs/${id}`, { method: "DELETE" });
      loadLogs();
    } catch (err) {
      setError(err.message);
    }
  };

  const openAddFood = (mealType) => {
    setModalMealType(mealType);
    setModalOpen(true);
  };

  const mealsByType = { breakfast: [], lunch: [], dinner: [], snack: [] };
  logs.forEach((log) => {
    mealsByType[log.meal_type]?.push(log);
  });

  const totalCalories = logs.reduce((sum, l) => sum + l.calories, 0);

  return (
    <div className="content-grid" style={{ gridTemplateColumns: "1fr" }}>
      <div className="panel">
        <div className="panel-header">
          <div>
            <h2>Food diary</h2>
            <p>{Math.round(totalCalories)} kcal enregistrées ce jour</p>
          </div>

          <div className="date-nav">
            <button onClick={() => changeDay(-1)} aria-label="Previous day">
              <ChevronLeft size={18} />
            </button>
            <span>{formatDateLabel(selectedDate)}</span>
            <button onClick={() => changeDay(1)} aria-label="Next day">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {error && <div className="login-alert login-alert-error">{error}</div>}

        {loading ? (
          <p>Chargement...</p>
        ) : (
          MEAL_TYPES.map(({ key, label, icon }) => {
            const entries = mealsByType[key];
            const mealTotal = entries.reduce((sum, e) => sum + e.calories, 0);

            return (
              <div className="diary-meal-group" key={key}>
                <div className="diary-meal-header">
                  <span>{icon} {label}</span>
                  <div>
                    <span className="diary-meal-total">{Math.round(mealTotal)} kcal</span>
                    <button className="diary-add-btn" onClick={() => openAddFood(key)}>
                      <Plus size={14} /> Add
                    </button>
                  </div>
                </div>

                {entries.length === 0 ? (
                  <p className="diary-empty">No food added yet</p>
                ) : (
                  entries.map((entry) => (
                    <div className="diary-entry" key={entry.id}>
                      <div>
                        <strong>{entry.food_item.name}</strong>
                        <span>{entry.quantity_g}g</span>
                      </div>
                      <div className="diary-entry-right">
                        <span>{Math.round(entry.calories)} kcal</span>
                        <button onClick={() => handleDelete(entry.id)} aria-label="Delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            );
          })
        )}
      </div>

      <AddFoodModal
        isOpen={modalOpen}
        defaultMealType={modalMealType}
        loggedDate={selectedDate}
        onClose={() => setModalOpen(false)}
        onAdded={() => {
          setModalOpen(false);
          loadLogs();
        }}
      />
    </div>
  );
}
