import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const ROLE_LABEL = {
  member: "My Dashboard",
  officer: "Officer Dashboard",
  admin: "Admin Dashboard",
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  const scrollToSection = (id) => {
    setMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-top">
        <div className="nav-brand">🌾 AgriConnect</div>

        <button
          type="button"
          className={`hamburger ${menuOpen ? "open" : ""}`}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <button type="button" className="nav-link" onClick={() => scrollToSection("weather")}>
          Weather
        </button>
        <button type="button" className="nav-link" onClick={() => scrollToSection("harvest")}>
          Harvest
        </button>
        <button type="button" className="nav-link" onClick={() => scrollToSection("posts")}>
          Posts
        </button>
        <button type="button" className="nav-link" onClick={() => scrollToSection("inquiries")}>
          Inquiries
        </button>
        <button type="button" className="nav-link" onClick={() => scrollToSection("officers")}>
          Officers
        </button>

        {user ? (
          <>
            <Link to={`/${user.role}`} className="admin-btn" onClick={() => setMenuOpen(false)}>
              {ROLE_LABEL[user.role]}
            </Link>
            <button type="button" className="nav-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="admin-btn" onClick={() => setMenuOpen(false)}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}