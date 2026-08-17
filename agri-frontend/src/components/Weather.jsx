import { useState, useEffect } from "react";

export default function Weather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock weather data (replace with real API later)
    const timer = setTimeout(() => {
      setWeather({
        location: "Farm Region",
        temp: 28,
        condition: "Partly Cloudy",
        humidity: 65,
        wind: 12,
        forecast: [
          { day: "Today", temp: 28, icon: "⛅" },
          { day: "Tomorrow", temp: 30, icon: "☀️" },
          { day: "Wed", temp: 26, icon: "🌧️" },
          { day: "Thu", temp: 27, icon: "⛅" },
        ],
      });
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <section className="card">Loading weather...</section>;

  return (
    <section id="weather" className="card">
      <h2>🌤️ Weather Forecast</h2>
      <div className="weather-main">
        <div className="temp">{weather.temp}°C</div>
        <div>
          <p>
            <strong>{weather.location}</strong>
          </p>
          <p>{weather.condition}</p>
          <p>
            Humidity: {weather.humidity}% | Wind: {weather.wind} km/h
          </p>
        </div>
      </div>
      <div className="forecast">
        {weather.forecast.map((f) => (
          <div key={f.day} className="forecast-item">
            <span>{f.day}</span>
            <span className="icon">{f.icon}</span>
            <span>{f.temp}°C</span>
          </div>
        ))}
      </div>
    </section>
  );
}
