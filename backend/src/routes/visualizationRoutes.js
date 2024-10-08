const express = require('express');
const { getPortfolioPerformance, getAssetAllocationData } = require('../controllers/visualizationController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/performance', getPortfolioPerformance);
router.get('/allocation', getAssetAllocationData);

module.exports = router;