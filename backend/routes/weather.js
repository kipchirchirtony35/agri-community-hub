import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const city = req.query.city || "Nairobi";

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    );

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Unable to fetch weather data",
      });
    }

    const data = await response.json();

    res.json({
      city: data.name,
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
    });
  } catch (error) {
    console.error("Weather API error:", error);

    res.status(500).json({
      error: "Server error while fetching weather data",
    });
  }
});

export default router;