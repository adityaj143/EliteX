const express = require('express');
const router = express.Router();
const recommendationsController = require('../controllers/recommendationsController');

router.post('/', recommendationsController.getAIRecommendations);

module.exports = router;
