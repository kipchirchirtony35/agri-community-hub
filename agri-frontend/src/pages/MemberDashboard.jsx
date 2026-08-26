import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { readJSON } from "../utils/storage";

export default function MemberDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { harvests, posts, inquiries } = useMemo(() => {
    const name = user.name.toLowerCase();
    const allHarvests = readJSON("harvests", []);
    const allPosts = readJSON("posts", []);
    const allInquiries = readJSON("inquiries", []);
    return {
      harvests: allHarvests.filter((h) => h.farmerName?.toLowerCase() === name),
      posts: allPosts.filter((p) => p.author?.toLowerCase() === name),
      inquiries: allInquiries.filter((i) => i.name?.toLowerCase() === name),
    };
  }, [user.name]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header member-header">
        <div>
          <h1>🧑‍🌾 Welcome, {user.name}</h1>
          <p className="dashboard-subtitle">Your AgriConnect activity in one place</p>
        </div>
        <div className="dashboard-actions">
          <Link to="/" className="ghost-btn">Back to site</Link>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>🚜 Your Harvests ({harvests.length})</h2>
          {harvests.length === 0 ? (
            <p className="empty-state">
              No harvests recorded yet. <Link to="/#harvest">Record one</Link> using this
              username so it shows up here.
            </p>
          ) : (
            harvests.map((h) => (
              <div key={h.id} className="dashboard-item">
                {h.crop}: {h.quantity} {h.unit} <span className="muted">({h.date})</span>
              </div>
            ))
          )}
        </div>

        <div className="dashboard-card">
          <h2>📢 Your Posts ({posts.length})</h2>
          {posts.length === 0 ? (
            <p className="empty-state">
              You haven't posted yet. <Link to="/#posts">Share something</Link> with the community.
            </p>
          ) : (
            posts.map((p) => (
              <div key={p.id} className="dashboard-item">
                {p.content} <span className="muted">({p.date})</span>
              </div>
            ))
          )}
        </div>

        <div className="dashboard-card">
          <h2>✉️ Your Inquiries ({inquiries.length})</h2>
          {inquiries.length === 0 ? (
            <p className="empty-state">
              No inquiries sent. <Link to="/#inquiries">Ask an officer</Link> a question.
            </p>
          ) : (
            inquiries.map((i) => (
              <div key={i.id} className="dashboard-item">
                {i.message} <span className="muted">({i.date})</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
