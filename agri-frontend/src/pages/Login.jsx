import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ROLES = [
  { id: "member", label: "Member", icon: "🧑‍🌾" },
  { id: "officer", label: "Officer", icon: "🧑‍💼" },
  { id: "admin", label: "Admin", icon: "🛠️" },
];

export default function Login() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [role, setRole] = useState("member");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const activeRole = ROLES.find((r) => r.id === role);
  const redirectTo = location.state?.from;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const result =
      mode === "login"
        ? await login(email, password)
        : await register(name, email, password, role);

    if (result.user) {
      const targetRole = result.user.role;
      navigate(redirectTo && redirectTo !== "/login" ? redirectTo : `/${targetRole}`, {
        replace: true,
      });
    } else {
      setError(result.error || (mode === "login" ? "Login failed." : "Registration failed."));
    }
    setSubmitting(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🌾 AgriConnect {mode === "login" ? "Login" : "Register"}</h1>

        {mode === "register" && (
          <div className="role-tabs" role="tablist" aria-label="Choose account type">
            {ROLES.map((r) => (
              <button
                key={r.id}
                type="button"
                role="tab"
                aria-selected={role === r.id}
                className={`role-tab ${role === r.id ? "active" : ""}`}
                onClick={() => setRole(r.id)}
              >
                <span className="role-tab-icon">{r.icon}</span>
                {r.label}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                autoComplete="name"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
          </div>

          <button type="submit" disabled={submitting}>
            {submitting
              ? mode === "login"
                ? "Signing in…"
                : "Creating account…"
              : mode === "login"
              ? `Sign in as ${activeRole.label}`
              : `Create ${activeRole.label} account`}
          </button>

          {error && (
            <p className="login-message error" role="alert">
              {error}
            </p>
          )}
        </form>

        <p className="hint">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button type="button" className="link-btn" onClick={() => { setMode("register"); setError(""); }}>
                Register here
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button type="button" className="link-btn" onClick={() => { setMode("login"); setError(""); }}>
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
