const express = require('express');
const { getUserPreferences, updateUserPreferences } = require('../controllers/userPreferenceController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/preferences', getUserPreferences);
router.put('/preferences', updateUserPreferences);

module.exports = router;