const express = require('express');
const { 
  getPortfolioSummary, 
  getAssetAllocation, 
  getAIRecommendations,
  getPortfolioPerformance
} = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/summary', getPortfolioSummary);
router.get('/allocation', getAssetAllocation);
router.get('/recommendations', getAIRecommendations);
router.get('/performance', getPortfolioPerformance);

module.exports = router;