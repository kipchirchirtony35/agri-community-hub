import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ROLE_LABEL = {
  member: "My Dashboard",
  officer: "Officer Dashboard",
  admin: "Admin Dashboard",
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">🌾 AgriConnect</div>
      <div className="nav-links">
        <a href="#weather">Weather</a>
        <a href="#harvest">Harvest</a>
        <a href="#posts">Posts</a>
        <a href="#inquiries">Inquiries</a>
        <a href="#officers">Officers</a>

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
