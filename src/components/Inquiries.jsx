import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { readJSON, writeJSON } from "../utils/storage";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Inquiries() {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [form, setForm] = useState({
    name: user?.role === "member" ? user.username : "",
    email: "",
    message: "",
  });
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState("");

  useEffect(() => {
    setInquiries(readJSON("inquiries", []));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setConfirmation("");

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (!EMAIL_PATTERN.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    const newInq = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
      id: Date.now(),
      date: new Date().toLocaleString(),
    };
    const updated = [newInq, ...inquiries];
    setInquiries(updated);
    writeJSON("inquiries", updated);
    setForm((f) => ({ ...f, email: "", message: "" }));
    setConfirmation("Inquiry submitted! An officer will respond soon.");
  };

  return (
    <section id="inquiries" className="card">
      <h2>✉️ Send Inquiry</h2>
      <form onSubmit={handleSubmit} className="inquiry-form">
        <input
          placeholder="Your Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <textarea
          placeholder="Your question or request..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          rows={4}
        />
        <button type="submit">Submit Inquiry</button>
        {error && <p className="form-message error">{error}</p>}
        {confirmation && <p className="form-message success">{confirmation}</p>}
      </form>
    </section>
  );
}
