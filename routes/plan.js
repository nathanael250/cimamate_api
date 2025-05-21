const express = require("express");
const jwt = require("jsonwebtoken");
const Plan = require("../models/plan");

const router = express.Router();

const verify = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) return res.sendStatus(403);

    jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(401);
        req.userId = decoded.id;
        next();
    });
};

// Add a plan
router.post("/add", verify, async (req, res) => {
    const { place, time, date } = req.body;
    const plan = new Plan({ userId: req.userId, place, time, date });
    await plan.save();
    res.json({ msg: "Plan added" });
});

// Get today’s plan
router.get("/today", verify, async (req, res) => {
    const today = new Date().toISOString().split("T")[0];
    const plans = await Plan.find({ userId: req.userId, date: today });
    res.json(plans);
});

module.exports = router;
