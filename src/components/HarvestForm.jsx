import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { readJSON, writeJSON } from "../utils/storage";

const today = () => new Date().toISOString().split("T")[0];

export default function HarvestForm() {
  const { user } = useAuth();
  const [harvests, setHarvests] = useState([]);
  const [form, setForm] = useState({
    farmerName: user?.role === "member" ? user.username : "",
    crop: "",
    quantity: "",
    unit: "kg",
    date: today(),
  });
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState("");

  useEffect(() => {
    setHarvests(readJSON("harvests", []));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setConfirmation("");

    if (!form.farmerName.trim() || !form.crop.trim() || !form.quantity) {
      setError("Please fill in your name, crop, and quantity.");
      return;
    }
    if (Number(form.quantity) <= 0) {
      setError("Quantity must be greater than zero.");
      return;
    }

    setError("");
    const newHarvest = { ...form, farmerName: form.farmerName.trim(), id: Date.now() };
    const updated = [newHarvest, ...harvests];
    setHarvests(updated);
    writeJSON("harvests", updated);
    setForm((f) => ({ ...f, crop: "", quantity: "" }));
    setConfirmation("Harvest recorded successfully!");
  };

  return (
    <section id="harvest" className="card">
      <h2>🚜 Record Your Harvest</h2>
      <form onSubmit={handleSubmit} className="harvest-form">
        <input
          placeholder="Farmer Name *"
          value={form.farmerName}
          onChange={(e) => setForm({ ...form, farmerName: e.target.value })}
        />
        <input
          placeholder="Crop (e.g. Maize, Rice) *"
          value={form.crop}
          onChange={(e) => setForm({ ...form, crop: e.target.value })}
        />
        <div className="row">
          <input
            type="number"
            min="0"
            step="any"
            placeholder="Quantity *"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          />
          <select
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
          >
            <option value="kg">kg</option>
            <option value="tons">tons</option>
            <option value="bags">bags</option>
          </select>
        </div>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
        <button type="submit">Submit Harvest</button>
        {error && <p className="form-message error">{error}</p>}
        {confirmation && <p className="form-message success">{confirmation}</p>}
      </form>

      {user?.role === "member" && (
        <p className="hint">
          Signed in as <strong>{user.username}</strong> — this entry will appear in
          your member dashboard.
        </p>
      )}

      <h3>Recent Harvests</h3>
      <div className="harvest-list">
        {harvests.length === 0 && <p className="empty-state">No harvests recorded yet.</p>}
        {harvests.slice(0, 5).map((h) => (
          <div key={h.id} className="harvest-item">
            <strong>{h.farmerName}</strong> – {h.crop}: {h.quantity} {h.unit} ({h.date})
          </div>
        ))}
      </div>
    </section>
  );
}
