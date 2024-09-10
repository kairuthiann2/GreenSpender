const express = require('express');
const db = require('../db');
const { calculateImpactMetrics } = require('../controllers/metricsControllers');
const { authenticateToken } = require('../userAuth/auth');

// Create an instance of express
const router = express.Router();

// Applying the authenticate middleware
router.use(authenticateToken);

router.get('/', async (req, res) => {
    try {
        // console.log(req.user);
        const userId = req.user.id;
        const metrics = await calculateImpactMetrics(userId);
        res.json(metrics);
        
    } catch (error) {
        console.error('Error fetching metrics data:', error);
        res.status(500).json({ message: 'Failed to fetch metrics data', error });
    }
});

module.exports = router;