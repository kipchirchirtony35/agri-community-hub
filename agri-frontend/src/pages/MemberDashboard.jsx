import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { readJSON, writeJSON } from "../utils/storage";

export default function MemberDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    setOrders(readJSON("orders", []));
  }, []);

  const { harvests, posts, inquiries, mySales } = useMemo(() => {
    const name = user.name.toLowerCase();
    const allHarvests = readJSON("harvests", []);
    const allPosts = readJSON("posts", []);
    const allInquiries = readJSON("inquiries", []);

    // Flatten every order item belonging to this farmer, keeping a
    // reference to which order/index it came from so it can be marked
    // fulfilled individually (orders can mix items from several farmers).
    const sales = [];
    orders.forEach((order) => {
      order.items.forEach((item, itemIndex) => {
        if (item.farmerName?.toLowerCase() === name) {
          sales.push({ order, item, itemIndex });
        }
      });
    });

    return {
      harvests: allHarvests.filter((h) => h.farmerName?.toLowerCase() === name),
      posts: allPosts.filter((p) => p.author?.toLowerCase() === name),
      inquiries: allInquiries.filter((i) => i.name?.toLowerCase() === name),
      mySales: sales,
    };
  }, [user.name, orders]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const markFulfilled = (orderId, itemIndex) => {
    const updated = orders.map((o) => {
      if (o.id !== orderId) return o;
      const items = o.items.map((it, idx) =>
        idx === itemIndex ? { ...it, fulfilled: true } : it
      );
      return { ...o, items };
    });
    setOrders(updated);
    writeJSON("orders", updated);
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
        <div className="dashboard-card wide">
          <h2>📦 Incoming Orders ({mySales.length})</h2>
          {mySales.length === 0 ? (
            <p className="empty-state">
              No orders yet. List produce for sale from the{" "}
              <Link to="/#harvest">Harvest form</Link> to start selling.
            </p>
          ) : (
            mySales.map(({ order, item, itemIndex }) => (
              <div key={`${order.id}-${itemIndex}`} className="dashboard-item order-item">
                <div>
                  <strong>{item.crop}</strong> — {item.qty} {item.unit} to{" "}
                  <strong>{order.buyer}</strong>
                  <span className="muted"> ({order.date})</span>
                  <div className="muted">
                    KES {(item.price * item.qty).toLocaleString()}
                  </div>
                </div>
                {item.fulfilled ? (
                  <span className="status-badge fulfilled">Fulfilled</span>
                ) : (
                  <button
                    type="button"
                    className="ghost-btn small"
                    onClick={() => markFulfilled(order.id, itemIndex)}
                  >
                    Mark fulfilled
                  </button>
                )}
              </div>
            ))
          )}
        </div>

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
                {h.forSale && (
                  <span className="muted"> · listed at KES {Number(h.price).toLocaleString()}</span>
                )}
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