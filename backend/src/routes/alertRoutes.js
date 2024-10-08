const express = require('express');
const { createAlert, getAlerts, deleteAlert } = require('../controllers/alertController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/', createAlert);
router.get('/', getAlerts);
router.delete('/:id', deleteAlert);

module.exports = router;