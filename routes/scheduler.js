

const cron = require("node-cron");
const axios = require("axios");
const Plan = require("../models/plan");
const User = require("../models/user");
const mongoose = require("mongoose");
cron.schedule("* * * * *", async () => {
    const now = new Date();
    const fiveMinsFromNow = new Date(now.getTime() + 5 * 60000);
    const today = now.toISOString().split("T")[0];

    try {
        const plans = await Plan.find({ date: today });

        for (const plan of plans) {
            const [hours, minutes] = plan.time.split(":");
            const planTime = new Date(`${plan.date}T${hours}:${minutes}:00`);

            if (
                planTime > now &&
                planTime <= fiveMinsFromNow
            ) {
                const weather = await axios.get(
                    `https://api.openweathermap.org/data/2.5/weather?q=${plan.place}&appid=${process.env.WEATHER_API_KEY}&units=metric`
                );

                const condition = weather.data.weather[0].main;
                const temp = weather.data.main.temp;

                // Simulate sending a notification
                const user = await User.findById(plan.userId);
                console.log(
                    `🔔 Hey ${user.name}, weather at ${plan.place} in 5 minutes is "${condition}" and ${temp}°C`
                );

                
            }
        }
    } catch (err) {
        console.error("Scheduler error:", err.message);
    }
});
