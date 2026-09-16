import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Utensils,
  Target,
  TrendingUp,
  Settings,
  LogOut,
  Flame,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "../App.css";

export default function AppLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navClass = ({ isActive }) => (isActive ? "active" : undefined);

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <Flame size={22} />
          </div>
          <span>NutriTrack</span>
        </div>

        <nav>
          <NavLink to="/" end className={navClass}>
            <LayoutDashboard size={19} />
            Dashboard
          </NavLink>

          <NavLink to="/food-diary" className={navClass}>
            <Utensils size={19} />
            Food diary
          </NavLink>

          <NavLink to="/goals" className={navClass}>
            <Target size={19} />
            Goals
          </NavLink>

          <NavLink to="/progress" className={navClass}>
            <TrendingUp size={19} />
            Progress
          </NavLink>
        </nav>

        <div className="sidebar-bottom">
          <a>
            <Settings size={19} />
            Settings
          </a>
          <a onClick={handleLogout} style={{ cursor: "pointer" }}>
            <LogOut size={19} />
            Logout
          </a>
        </div>
      </aside>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
