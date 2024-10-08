const express = require('express');
const {
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist,
  updateWatchlistAlert,
  getWatchlistRecommendations
} = require('../controllers/watchlistController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/', addToWatchlist);
router.get('/', getWatchlist);
router.delete('/:id', removeFromWatchlist);
router.put('/:id/alert', updateWatchlistAlert);
router.get('/recommendations', getWatchlistRecommendations);

module.exports = router;