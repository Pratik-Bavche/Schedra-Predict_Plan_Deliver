import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Test Route
app.get("/", (req, res) => {
    res.send("Schedra API is running...");
});

// Routes
import projectRoutes from "./routes/projectRoutes.js";
import mlRoutes from "./routes/mlRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

app.use("/api/projects", projectRoutes);
app.use("/api/predict", mlRoutes);
app.use("/api/analytics", analyticsRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
