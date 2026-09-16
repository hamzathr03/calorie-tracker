import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { apiFetch } from "../lib/api";
import "./AddFoodModal.css";

const MEAL_OPTIONS = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snack", label: "Snack" },
];

export default function AddFoodModal({ isOpen, defaultMealType, loggedDate, onClose, onAdded }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(100);
  const [mealType, setMealType] = useState(defaultMealType || "breakfast");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Reset the form's transient state each time the modal is (re)opened.
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setResults([]);
      setSelectedItem(null);
      setQuantity(100);
      setMealType(defaultMealType || "breakfast");
      setError("");
    }
  }, [isOpen, defaultMealType]);

  // Debounced search as the user types.
  useEffect(() => {
    if (!isOpen || selectedItem) return;

    const handle = setTimeout(() => {
      setSearching(true);
      apiFetch(`/food-items?search=${encodeURIComponent(query)}`)
        .then(setResults)
        .catch(() => setResults([]))
        .finally(() => setSearching(false));
    }, 300);

    return () => clearTimeout(handle);
  }, [query, isOpen, selectedItem]);

  if (!isOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await apiFetch("/food-logs", {
        method: "POST",
        body: JSON.stringify({
          food_item_id: selectedItem.id,
          meal_type: mealType,
          quantity_g: Number(quantity),
          ...(loggedDate ? { logged_date: loggedDate } : {}),
        }),
      });
      onAdded();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add food</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {error && <div className="login-alert login-alert-error">{error}</div>}

        {!selectedItem ? (
          <>
            <div className="modal-search">
              <Search size={17} className="modal-search-icon" />
              <input
                type="text"
                placeholder="Search a food (e.g. chicken, rice...)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
            </div>

            <div className="modal-results">
              {searching && <p className="modal-hint">Searching...</p>}

              {!searching && results.length === 0 && (
                <p className="modal-hint">
                  {query ? "No food found." : "Type to search the food catalog."}
                </p>
              )}

              {results.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="modal-result-row"
                  onClick={() => setSelectedItem(item)}
                >
                  <span>{item.name}</span>
                  <span className="modal-result-meta">
                    {item.calories} kcal / {item.serving_size_g}g
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="modal-selected-item">
              <span>{selectedItem.name}</span>
              <button type="button" onClick={() => setSelectedItem(null)}>
                Change
              </button>
            </div>

            <div className="login-field">
              <label htmlFor="meal_type">Meal</label>
              <select
                id="meal_type"
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
              >
                {MEAL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="login-field">
              <label htmlFor="quantity">Quantity (g)</label>
              <input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-submit" disabled={submitting}>
              {submitting ? "Adding..." : "Add to diary"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
