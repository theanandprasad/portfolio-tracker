const express = require('express');
const {
  addInvestment,
  getInvestments,
  updateInvestment,
  deleteInvestment,
  getCurrentPrices,
  getInvestmentHistory,
  getRecentActivities
} = require('../controllers/portfolioController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/', addInvestment);
router.get('/', getInvestments);
router.put('/:id', updateInvestment);
router.delete('/:id', deleteInvestment);
router.get('/prices', getCurrentPrices);
router.get('/:id/history', getInvestmentHistory);
router.get('/activities', getRecentActivities);

module.exports = router;