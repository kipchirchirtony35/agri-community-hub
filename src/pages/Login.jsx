import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ROLES = [
  {
    id: "member",
    label: "Member",
    icon: "🧑‍🌾",
    hint: "New here? Just pick a username and password — your account is created automatically.",
  },
  {
    id: "officer",
    label: "Officer",
    icon: "🧑‍💼",
    hint: "Demo: amina / james / sarah / peter — password officer123",
  },
  {
    id: "admin",
    label: "Admin",
    icon: "🛠️",
    hint: "Demo: admin / 1234",
  },
];

export default function Login() {
  const [role, setRole] = useState("member");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const activeRole = ROLES.find((r) => r.id === role);
  const redirectTo = location.state?.from;

  const handleRoleChange = (nextRole) => {
    setRole(nextRole);
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const result = login(role, username, password);

    if (result.user) {
      navigate(redirectTo && redirectTo !== "/login" ? redirectTo : `/${role}`, {
        replace: true,
      });
    } else {
      setError(result.error || "Login failed.");
    }
    setSubmitting(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🌾 AgriConnect Login</h1>

        <div className="role-tabs" role="tablist" aria-label="Choose login type">
          {ROLES.map((r) => (
            <button
              key={r.id}
              type="button"
              role="tab"
              aria-selected={role === r.id}
              className={`role-tab ${role === r.id ? "active" : ""}`}
              onClick={() => handleRoleChange(r.id)}
            >
              <span className="role-tab-icon">{r.icon}</span>
              {r.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={role === "admin" ? "admin" : "e.g. " + (role === "officer" ? "amina" : "your name")}
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••"
              autoComplete="current-password"
            />
          </div>

          <button type="submit" disabled={submitting}>
            {submitting ? "Signing in…" : `Sign in as ${activeRole.label}`}
          </button>

          {error && (
            <p className="login-message error" role="alert">
              {error}
            </p>
          )}
        </form>

        <p className="hint">{activeRole.hint}</p>
      </div>
    </div>
  );
}
