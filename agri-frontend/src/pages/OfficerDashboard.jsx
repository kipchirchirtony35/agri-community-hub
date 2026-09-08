import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { readJSON } from "../utils/storage";
import { officers } from "../data/officers";

export default function OfficerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    setOrders(readJSON("orders", []));
  }, []);

  const { inquiries, harvests, posts } = useMemo(
    () => ({
      inquiries: readJSON("inquiries", []),
      harvests: readJSON("harvests", []),
      posts: readJSON("posts", []),
    }),
    []
  );

  const officer = officers.find(
    (o) => o.name.toLowerCase() === user.name.toLowerCase()
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="dashboard">
      <header className="dashboard-header officer-header">
        <div>
          <h1>🧑‍💼 {officer?.name || user.name}</h1>
          <p className="dashboard-subtitle">{officer?.role} · {officer?.specialty}</p>
        </div>
        <div className="dashboard-actions">
          <Link to="/" className="ghost-btn">Back to site</Link>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="dashboard-grid">
        <div className="dashboard-card wide">
          <h2>🧾 Marketplace Orders ({orders.length})</h2>
          {orders.length === 0 ? (
            <p className="empty-state">No orders placed yet.</p>
          ) : (
            <>
              <p className="muted">
                Total order value: KES {totalRevenue.toLocaleString()}
              </p>
              {orders.map((o) => (
                <div key={o.id} className="dashboard-item">
                  <div className="post-header">
                    <strong>{o.buyer}</strong>
                    <span className="muted">{o.date}</span>
                  </div>
                  {o.items.map((item, idx) => (
                    <div key={idx} className="muted">
                      {item.crop} — {item.qty} {item.unit} from{" "}
                      <strong>{item.farmerName}</strong>{" "}
                      {item.fulfilled ? (
                        <span className="status-badge fulfilled">Fulfilled</span>
                      ) : (
                        <span className="status-badge pending">Pending</span>
                      )}
                    </div>
                  ))}
                  <p>Total: KES {o.total.toLocaleString()}</p>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="dashboard-card wide">
          <h2>✉️ Farmer Inquiries ({inquiries.length})</h2>
          {inquiries.length === 0 ? (
            <p className="empty-state">No inquiries yet. They'll appear here as farmers submit them.</p>
          ) : (
            inquiries.map((i) => (
              <div key={i.id} className="dashboard-item">
                <div className="post-header">
                  <strong>{i.name}</strong>
                  <span className="muted">{i.date}</span>
                </div>
                <p>{i.message}</p>
                <p className="muted">{i.email}</p>
              </div>
            ))
          )}
        </div>

        <div className="dashboard-card">
          <h2>🚜 Recent Harvests ({harvests.length})</h2>
          {harvests.length === 0 ? (
            <p className="empty-state">No harvests recorded yet.</p>
          ) : (
            harvests.slice(0, 8).map((h) => (
              <div key={h.id} className="dashboard-item">
                <strong>{h.farmerName}</strong> – {h.crop}: {h.quantity} {h.unit}
              </div>
            ))
          )}
        </div>

        <div className="dashboard-card">
          <h2>📢 Community Posts ({posts.length})</h2>
          {posts.length === 0 ? (
            <p className="empty-state">No posts yet.</p>
          ) : (
            posts.slice(0, 8).map((p) => (
              <div key={p.id} className="dashboard-item">
                <strong>{p.author}</strong>: {p.content}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}