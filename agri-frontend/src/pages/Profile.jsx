import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// NOTE: This page expects a real JWT token saved under localStorage key
// "authToken" from a real backend login (POST /api/auth/login). Your
// current AuthContext uses a separate local/demo login system, so this
// page will show "not logged in" until the Login page is connected to
// the real backend — see the auth.js integration step.

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({ name: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${API_BASE}/api/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setProfile(json.data);
          setForm({ name: json.data.name, email: json.data.email });
        } else {
          setError(json.message || "Could not load profile");
        }
      })
      .catch(() => setError("Could not reach the server"))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const json = await res.json();

      if (json.success) {
        setProfile((p) => ({ ...p, ...json.data }));
        setMessage("Profile updated successfully.");
      } else {
        setError(json.message || "Update failed");
      }
    } catch {
      setError("Could not reach the server");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMessage("");
    setPasswordError("");

    try {
      const res = await fetch(`${API_BASE}/api/profile/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwordForm),
      });
      const json = await res.json();

      if (json.success) {
        setPasswordMessage("Password updated successfully.");
        setPasswordForm({ currentPassword: "", newPassword: "" });
      } else {
        setPasswordError(json.message || "Password update failed");
      }
    } catch {
      setPasswordError("Could not reach the server");
    }
  };

  if (!token) {
    return (
      <section className="card">
        <h2>👤 My Profile</h2>
        <p className="empty-state">
          You need to be logged in to view your profile.{" "}
          <Link to="/login">Go to login</Link>
        </p>
      </section>
    );
  }

  if (loading) return <section className="card">Loading profile...</section>;

  return (
    <section className="card">
      <h2>👤 My Profile</h2>

      {error && <p className="form-message error">{error}</p>}

      {profile && (
        <>
          <form onSubmit={handleSave} className="profile-form">
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <p className="muted">Role: {profile.role}</p>
            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </button>
            {message && <p className="form-message success">{message}</p>}
          </form>

          <h3>Change Password</h3>
          <form onSubmit={handlePasswordChange} className="profile-form">
            <input
              type="password"
              placeholder="Current password"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="New password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, newPassword: e.target.value })
              }
            />
            <button type="submit">Update password</button>
            {passwordMessage && <p className="form-message success">{passwordMessage}</p>}
            {passwordError && <p className="form-message error">{passwordError}</p>}
          </form>
        </>
      )}
    </section>
  );
}
