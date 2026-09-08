import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { readJSON, writeJSON } from "../utils/storage";

export default function Cart() {
  const { items, updateQty, removeItem, clearCart, total } = useCart();
  const { user } = useAuth();
  const [placed, setPlaced] = useState(false);

  const handleCheckout = () => {

    const order = {
      id: Date.now(),
      buyer: user?.name || "Guest",
      items: items.map((i) => ({ ...i, fulfilled: false })), // ← was just `items`
      total,
      date: new Date().toISOString().split("T")[0],
      status: "pending",
    };

    const orders = readJSON("orders", []);
    writeJSON("orders", [order, ...orders]);
    clearCart();
    setPlaced(true);
  };

  if (placed) {
    return (
      <div className="app">
        <Navbar />
        <main className="container">
          <section className="card">
            <h2>✅ Order placed!</h2>
            <p>Thanks for your order — the farmer(s) have been notified.</p>
            <Link to="/shop" className="admin-btn">Continue shopping</Link>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar />
      <main className="container">
        <section className="card">
          <h2>🛒 Your Cart</h2>
          {items.length === 0 ? (
            <p className="empty-state">
              Your cart is empty. <Link to="/shop">Browse the marketplace</Link>.
            </p>
          ) : (
            <>
              <div className="cart-list">
                {items.map((i) => (
                  <div key={i.id} className="cart-item">
                    <div>
                      <strong>{i.crop}</strong>
                      <span className="muted"> — {i.farmerName}</span>
                    </div>
                    <div className="cart-item-controls">
                      <input
                        type="number"
                        min="1"
                        value={i.qty}
                        onChange={(e) => updateQty(i.id, Number(e.target.value))}
                      />
                      <span>{i.unit}</span>
                      <span>KES {(i.price * i.qty).toLocaleString()}</span>
                      <button type="button" onClick={() => removeItem(i.id)}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cart-total">
                <strong>Total: KES {total.toLocaleString()}</strong>
              </div>
              <button type="button" onClick={handleCheckout}>
                {user ? "Place Order" : "Login to Checkout"}
              </button>
            </>
          )}
        </section>
      </main>
    </div>
  );
}