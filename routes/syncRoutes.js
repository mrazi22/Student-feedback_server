const express = require('express');
const { syncOfflineFeedback } = require('../controllers/syncController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, syncOfflineFeedback); // ✅ Sync offline feedback

module.exports = router;