import { officers } from "../data/officers";

export default function Officers() {
  return (
    <section id="officers" className="card">
      <h2>👨‍🌾 Our Agricultural Officers</h2>
      <div className="officers-grid">
        {officers.map((o) => (
          <div key={o.id} className="officer-card">
            <div className="officer-avatar">{o.name.charAt(0)}</div>
            <h3>{o.name}</h3>
            <p className="role">{o.role}</p>
            <p className="specialty">{o.specialty}</p>
            <p>📞 {o.phone}</p>
            <p>✉️ {o.email}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
