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


/**
 * @swagger
 * /api/weather/search:
 *   get:
 *     summary: Get weather information for a city
 *     tags: [Weather]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *         description: City name
 *     responses:
 *       200:
 *         description: Weather information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 coord:
 *                   type: object
 *                   properties:
 *                     lon:
 *                       type: number
 *                     lat:
 *                       type: number
 *                 weather:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       main:
 *                         type: string
 *                       description:
 *                         type: string
 *                       icon:
 *                         type: string
 *                 main:
 *                   type: object
 *                   properties:
 *                     temp:
 *                       type: number
 *                     feels_like:
 *                       type: number
 *                     temp_min:
 *                       type: number
 *                     temp_max:
 *                       type: number
 *                     pressure:
 *                       type: number
 *                     humidity:
 *                       type: number
 *                 wind:
 *                   type: object
 *                   properties:
 *                     speed:
 *                       type: number
 *                     deg:
 *                       type: number
 *                 name:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: City not found or server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: City not found
 */
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
