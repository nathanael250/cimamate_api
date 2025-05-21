const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");

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

// Search by city
router.get("/search", verify, async (req, res) => {
    const { city } = req.query;
    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`
        );
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ msg: "City not found" });
    }
});

module.exports = router;
