import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "../utils/api";

const AuthContext = createContext(null);
const SESSION_KEY = "agri.session";
const TOKEN_KEY = "authToken";

// Maps between the backend's Role enum and the frontend's route/tab names
const BACKEND_TO_FRONTEND_ROLE = { FARMER: "member", OFFICER: "officer", ADMIN: "admin" };
const FRONTEND_TO_BACKEND_ROLE = { member: "FARMER", officer: "OFFICER", admin: "ADMIN" };

function toFrontendUser(apiUser) {
  return {
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    role: BACKEND_TO_FRONTEND_ROLE[apiUser.role] || apiUser.role,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [ready, setReady] = useState(false);

  // On first load, if a token exists, confirm it's still valid and refresh

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setReady(true);
      return;
    }

    apiFetch("/api/profile").then(({ ok, data }) => {
      if (ok && data.success) {
        const freshUser = toFrontendUser(data.data);
        setUser(freshUser);
        localStorage.setItem(SESSION_KEY, JSON.stringify(freshUser));
      } else {
        // Token invalid/expired — clear the stale session
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(SESSION_KEY);
        setUser(null);
      }
      setReady(true);
    });
  }, []);

  const login = async (email, password) => {
    const { ok, data } = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (!ok) {
      return { user: null, error: data.message || "Login failed." };
    }

    localStorage.setItem(TOKEN_KEY, data.token);
    const frontendUser = toFrontendUser(data.user);
    localStorage.setItem(SESSION_KEY, JSON.stringify(frontendUser));
    setUser(frontendUser);

    return { user: frontendUser };
  };

  const register = async (name, email, password, frontendRole) => {
    const backendRole = FRONTEND_TO_BACKEND_ROLE[frontendRole] || "FARMER";

    const { ok, data } = await apiFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, role: backendRole }),
    });

    if (!ok) {
      return { user: null, error: data.message || "Registration failed." };
    }

    // Registration succeeded — log in immediately to get a token
    return login(email, password);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, ready, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
