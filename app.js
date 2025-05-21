const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cron = require("node-cron");

dotenv.config();

const authRoutes = require("./routes/auth");
const weatherRoutes = require("./routes/weather");
const planRoutes = require("./routes/plan");

require("./routes/scheduler");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));



app.use("/api/auth", authRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/plan", planRoutes);


const PORT = process.env.PORT || 5000;
app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
);
