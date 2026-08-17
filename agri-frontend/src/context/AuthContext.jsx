import { createContext, useContext, useEffect, useState } from "react";
import { findOfficerByUsername } from "../data/officers";
import { readJSON, writeJSON } from "../utils/storage";

const AuthContext = createContext(null);
const SESSION_KEY = "agri.session";
const MEMBERS_KEY = "agri.members";

const ADMIN_CREDENTIALS = { username: "admin", password: "1234" };

// Returns { user, error }. user is null on failure.
function authenticate(role, username, password) {
  const cleanUsername = username.trim();

  if (!cleanUsername || !password.trim()) {
    return { user: null, error: "Please fill in all fields." };
  }

  if (role === "admin") {
    if (
      cleanUsername === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    ) {
      return { user: { username: cleanUsername, role: "admin", name: "Administrator" } };
    }
    return { user: null, error: "Invalid admin username or password." };
  }

  if (role === "officer") {
    const officer = findOfficerByUsername(cleanUsername);
    if (officer && officer.password === password) {
      return {
        user: {
          username: officer.username,
          role: "officer",
          name: officer.name,
          officerId: officer.id,
        },
      };
    }
    return { user: null, error: "Invalid officer username or password." };
  }

  if (role === "member") {
    // Members self-register on first login; afterwards their password
    // is checked against what was stored at signup.
    const members = readJSON(MEMBERS_KEY, {});
    const key = cleanUsername.toLowerCase();
    const existing = members[key];

    if (!existing) {
      if (password.length < 4) {
        return { user: null, error: "Password must be at least 4 characters." };
      }
      members[key] = { username: cleanUsername, password };
      writeJSON(MEMBERS_KEY, members);
      return { user: { username: cleanUsername, role: "member", name: cleanUsername } };
    }

    if (existing.password === password) {
      return { user: { username: existing.username, role: "member", name: existing.username } };
    }
    return { user: null, error: "Incorrect password for this member account." };
  }

  return { user: null, error: "Unknown login type." };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readJSON(SESSION_KEY, null));

  useEffect(() => {
    if (user) writeJSON(SESSION_KEY, user);
    else localStorage.removeItem(SESSION_KEY);
  }, [user]);

  const login = (role, username, password) => {
    const result = authenticate(role, username, password);
    if (result.user) setUser(result.user);
    return result;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
