const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/dashboard/:sessionId', dashboardController.getDashboard);
router.get('/savings-simulator/:sessionId', dashboardController.getSavingsSimulator);

module.exports = router;
