import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import weatherRouter from "./routes/weather.js";
import harvestsRouter from "./routes/harvests.js";
import officersRouter from "./routes/officers.js";
import authRouter from "./routes/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Agri Community Hub API is running",
  });
});

app.use("/api/auth", authRouter);
app.use("/weather", weatherRouter);
app.use("/harvests", harvestsRouter);
app.use("/officers", officersRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
