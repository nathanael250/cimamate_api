const cron = require("node-cron");

cron.schedule("* * * * *", () => {
    console.log("⏰ CRON: Scheduler is running:", new Date().toLocaleString());
});