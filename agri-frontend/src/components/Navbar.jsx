import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ROLE_LABEL = {
  member: "My Dashboard",
  officer: "Officer Dashboard",
  admin: "Admin Dashboard",
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const scrollToSection = (id) => {
    if (location.pathname !== "/") {
      // Not on the home page — navigate there first, then scroll after render
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
      <div className="nav-brand">🌾 AgriConnect</div>

         <div className="nav-links">
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
            <Link to={`/${user.role}`} className="admin-btn">
              {ROLE_LABEL[user.role]}
            </Link>
            <button type="button" className="nav-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="admin-btn">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
