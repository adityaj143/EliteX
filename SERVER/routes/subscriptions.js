const express = require('express');
const router = express.Router();
const multer = require('multer');
const subscriptionController = require('../controllers/subscriptionController');

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

router.post('/manual', subscriptionController.manualSubscriptions);
router.post('/csv', upload.single('file'), subscriptionController.csvSubscriptions);

module.exports = router;
