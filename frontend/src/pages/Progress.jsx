import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { apiFetch } from "../lib/api";
import "./Progress.css";

function formatDay(dateStr) {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

export default function Progress() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/summary/history?days=7")
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="content-grid" style={{ gridTemplateColumns: "1fr" }}>
        <div className="panel">
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-grid" style={{ gridTemplateColumns: "1fr" }}>
        <div className="panel">
          <p>Erreur: {error}</p>
        </div>
      </div>
    );
  }

  const chartData = data.history.map((d) => ({
    ...d,
    label: formatDay(d.date),
  }));

  const daysLogged = data.history.filter((d) => d.calories > 0).length;
  const avgCalories = daysLogged
    ? Math.round(
        data.history.reduce((sum, d) => sum + d.calories, 0) / daysLogged
      )
    : 0;

  return (
    <div className="content-grid" style={{ gridTemplateColumns: "1fr" }}>
      <div className="panel">
        <h2>Progress</h2>
        <p className="progress-intro">Tes calories des 7 derniers jours.</p>

        <div style={{ width: "100%", height: 280 }}>
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef1f5" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} width={40} />
              <Tooltip formatter={(value) => [`${value} kcal`, "Calories"]} />
              {data.calorie_goal && (
                <ReferenceLine
                  y={data.calorie_goal}
                  stroke="#22a06b"
                  strokeDasharray="4 4"
                  label={{ value: "Objectif", position: "insideTopRight", fontSize: 11, fill: "#22a06b" }}
                />
              )}
              <Bar dataKey="calories" fill="#22a06b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="progress-stats">
          <div>
            <span className="progress-stat-label">Moyenne</span>
            <strong>{avgCalories} kcal</strong>
          </div>
          {data.calorie_goal && (
            <div>
              <span className="progress-stat-label">Objectif</span>
              <strong>{data.calorie_goal} kcal</strong>
            </div>
          )}
          <div>
            <span className="progress-stat-label">Jours suivis</span>
            <strong>{daysLogged} / {data.days}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
