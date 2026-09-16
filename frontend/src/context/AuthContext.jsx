import { createContext, useContext, useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("nutritrack_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() =>
    localStorage.getItem("nutritrack_token")
  );
  const [loading, setLoading] = useState(true);

  // On first load, verify the stored token is still valid against the API
  // (covers the case where it was revoked/expired since the last visit).
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${API_BASE_URL}/user`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid session");
        return res.json();
      })
      .then((data) => {
        setUser(data);
        localStorage.setItem("nutritrack_user", JSON.stringify(data));
      })
      .catch(() => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("nutritrack_token");
        localStorage.removeItem("nutritrack_user");
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Email ou mot de passe incorrect.");
    }

    localStorage.setItem("nutritrack_token", data.token);
    localStorage.setItem("nutritrack_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (name, email, password, passwordConfirmation) => {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      const firstError = data.errors ? Object.values(data.errors)[0]?.[0] : null;
      throw new Error(firstError || data.message || "Erreur lors de l'inscription.");
    }

    localStorage.setItem("nutritrack_token", data.token);
    localStorage.setItem("nutritrack_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const refreshUser = async () => {
    if (!token) return;

    const response = await fetch(`${API_BASE_URL}/user`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    });

    if (response.ok) {
      const data = await response.json();
      setUser(data);
      localStorage.setItem("nutritrack_user", JSON.stringify(data));
    }
  };

  const logout = async () => {
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/logout`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });
      } catch {
        // Ignore network errors on logout — we clear local state regardless.
      }
    }
    localStorage.removeItem("nutritrack_token");
    localStorage.removeItem("nutritrack_user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
