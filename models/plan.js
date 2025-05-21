const mongoose = require("mongoose");

const PlanSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    place: String,
    time: String, // could be ISO datetime or HH:mm
    date: String  // e.g., "2024-05-20"
});

module.exports = mongoose.model("Plan", PlanSchema);
