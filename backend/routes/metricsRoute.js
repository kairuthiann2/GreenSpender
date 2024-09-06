const express = require('express');
const db = require('../db');
const { calculateImpactMetrics } = require('../controllers/metricsControllers');

// Create an instance of express
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const userId = req.user.id;
        const metrics = await calculateImpactMetrics(userId);
        res.json(metrics);
        
    } catch (error) {
        res.status(500).json('Failed to fetch metrics data', error);
    }
});

module.exports = router;