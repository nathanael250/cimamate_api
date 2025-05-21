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



/**
 * @swagger
 * /api/plan/add:
 *   post:
 *     summary: Add a new plan
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - place
 *               - time
 *               - date
 *             properties:
 *               place:
 *                 type: string
 *               time:
 *                 type: string
 *                 format: HH:MM
 *               date:
 *                 type: string
 *                 format: YYYY-MM-DD
 *     responses:
 *       200:
 *         description: Plan added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Plan added
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post("/add", verify, async (req, res) => {
    const { place, time, date } = req.body;
    const plan = new Plan({ userId: req.userId, place, time, date });
    await plan.save();
    res.json({ msg: "Plan added" });
});

/**
 * @swagger
 * /api/plan/today:
 *   get:
 *     summary: Get today's plans
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of today's plans
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   place:
 *                     type: string
 *                   time:
 *                     type: string
 *                   date:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/today", verify, async (req, res) => {
    const today = new Date().toISOString().split("T")[0];
    const plans = await Plan.find({ userId: req.userId, date: today });
    res.json(plans);
});


/**
 * @swagger
 * /api/plan/all:
 *   get:
 *     summary: Get all plans
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all plans
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   place:
 *                     type: string
 *                   time:
 *                     type: string
 *                   date:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/all", verify, async (req, res) => {
    try {
        const plans = await Plan.find({ userId: req.userId });
        res.json(plans);
    } catch (err) {
        res.status(500).json({ msg: "Error fetching plans" });
    }
});


/**
 * @swagger
 * /api/plan/update/{id}:
 *   put:
 *     summary: Update a plan
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Plan ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               place:
 *                 type: string
 *               time:
 *                 type: string
 *                 format: HH:MM
 *               date:
 *                 type: string
 *                 format: YYYY-MM-DD
 *     responses:
 *       200:
 *         description: Plan updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Plan updated
 *                 plan:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     userId:
 *                       type: string
 *                     place:
 *                       type: string
 *                     time:
 *                       type: string
 *                     date:
 *                       type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized to update this plan
 *       404:
 *         description: Plan not found
 */

router.put("/update/:id", verify, async (req, res) => {
    try {
        const { place, time, date } = req.body;
        
        const plan = await Plan.findById(req.params.id);
        if (!plan) return res.status(404).json({ msg: "Plan not found" });
        
        if (plan.userId.toString() !== req.userId) {
            return res.status(403).json({ msg: "Not authorized to update this plan" });
        }
 
        const updatedPlan = await Plan.findByIdAndUpdate(
            req.params.id, 
            { place, time, date },
            { new: true } 
        );
        
        res.json({ msg: "Plan updated", plan: updatedPlan });
    } catch (err) {
        res.status(500).json({ msg: "Error updating plan" });
    }
});

/**
 * @swagger
 * /api/plan/delete/{id}:
 *   delete:
 *     summary: Delete a plan
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Plan ID
 *     responses:
 *       200:
 *         description: Plan deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Plan deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized to delete this plan
 *       404:
 *         description: Plan not found
 */
router.delete("/delete/:id", verify, async (req, res) => {
    try {
        const plan = await Plan.findById(req.params.id);
        if (!plan) return res.status(404).json({ msg: "Plan not found" });

        if (plan.userId.toString() !== req.userId) {
            return res.status(403).json({ msg: "Not authorized to delete this plan" });
        }
        await Plan.findByIdAndDelete(req.params.id);
        
        res.json({ msg: "Plan deleted" });
    } catch (err) {
        res.status(500).json({ msg: "Error deleting plan" });
    }
});

module.exports = router;
