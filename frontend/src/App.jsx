import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import Dashboard from "./pages/Dashboard";
import FoodDiary from "./pages/FoodDiary";
import Goals from "./pages/Goals";
import Progress from "./pages/Progress";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/food-diary" element={<FoodDiary />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/progress" element={<Progress />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
