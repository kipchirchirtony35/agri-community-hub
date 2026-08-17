import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { readJSON } from "../utils/storage";

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const harvests = readJSON("harvests", []);
  const posts = readJSON("posts", []);
  const inquiries = readJSON("inquiries", []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header admin-header">
        <div>
          <h1>🛠️ Admin Dashboard</h1>
          <p className="dashboard-subtitle">Full view across all farmer activity</p>
        </div>
        <div className="dashboard-actions">
          <Link to="/" className="ghost-btn">Back to site</Link>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>🚜 Harvest Records ({harvests.length})</h2>
          {harvests.length === 0 ? (
            <p className="empty-state">No harvests recorded yet.</p>
          ) : (
            harvests.map((h) => (
              <div key={h.id} className="dashboard-item">
                <strong>{h.farmerName}</strong> – {h.crop}: {h.quantity} {h.unit}{" "}
                <span className="muted">({h.date})</span>
              </div>
            ))
          )}
        </div>

        <div className="dashboard-card">
          <h2>📢 Farmers Posts ({posts.length})</h2>
          {posts.length === 0 ? (
            <p className="empty-state">No posts yet.</p>
          ) : (
            posts.map((p) => (
              <div key={p.id} className="dashboard-item">
                <strong>{p.author}</strong>: {p.content.slice(0, 60)}
                {p.content.length > 60 ? "…" : ""}
              </div>
            ))
          )}
        </div>

        <div className="dashboard-card">
          <h2>✉️ Inquiries ({inquiries.length})</h2>
          {inquiries.length === 0 ? (
            <p className="empty-state">No inquiries yet.</p>
          ) : (
            inquiries.map((i) => (
              <div key={i.id} className="dashboard-item">
                <strong>{i.name}</strong> <span className="muted">({i.email})</span>:{" "}
                {i.message.slice(0, 50)}
                {i.message.length > 50 ? "…" : ""}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
