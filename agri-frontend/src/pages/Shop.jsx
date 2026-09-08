import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { readJSON } from "../utils/storage";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [added, setAdded] = useState(null);
  const { addItem } = useCart();

  useEffect(() => {
    const harvests = readJSON("harvests", []);
    setProducts(harvests.filter((h) => h.forSale && Number(h.price) > 0));
  }, []);

  const handleAdd = (product) => {
    addItem(
      {
        id: product.id,
        crop: product.crop,
        farmerName: product.farmerName,
        price: Number(product.price),
        unit: product.unit,
      },
      1
    );
    setAdded(product.id);
    setTimeout(() => setAdded(null), 1200);
  };

  return (
    <div className="app">
      <Navbar />
      <main className="container">
        <section className="hero">
          <h1>🛒 Marketplace</h1>
          <p>Buy produce listed directly by farmers on AgriConnect</p>
        </section>

        <section className="card">
          <h2>Available Produce</h2>
          {products.length === 0 && (
            <p className="empty-state">
              No listings yet. Farmers can list produce for sale from the
              Harvest form on the home page.
            </p>
          )}
          <div className="product-grid">
            {products.map((p) => (
              <div key={p.id} className="product-card">
                <h3>{p.crop}</h3>
                <p className="muted">by {p.farmerName}</p>
                <p className="product-qty">
                  {p.quantity} {p.unit} available
                </p>
                <p className="product-price">
                  KES {Number(p.price).toLocaleString()} / {p.unit}
                </p>
                <button type="button" onClick={() => handleAdd(p)}>
                  {added === p.id ? "Added ✓" : "Add to Cart"}
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}