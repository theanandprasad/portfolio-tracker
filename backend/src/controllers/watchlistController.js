const { WatchlistItem } = require('../models');
const { getStockPrice } = require('../services/financialApiService');
const { getInvestmentRecommendations } = require('../services/openAIService');

const addToWatchlist = async (req, res) => {
  try {
    const { symbol, name, alertPrice, alertType } = req.body;
    const watchlistItem = await WatchlistItem.create({
      userId: req.user.id,
      symbol,
      name,
      alertPrice,
      alertType,
    });
    res.status(201).json(watchlistItem);
  } catch (error) {
    res.status(400).json({ message: 'Failed to add item to watchlist', error: error.message });
  }
};

const getWatchlist = async (req, res) => {
  try {
    console.log('Fetching watchlist for user:', req.user.id);
    const watchlistItems = await WatchlistItem.findAll({ where: { userId: req.user.id } });
    console.log('Watchlist items found:', watchlistItems.length);

    const watchlistWithPrices = await Promise.all(watchlistItems.map(async (item) => {
      try {
        console.log(`Fetching price for ${item.symbol}`);
        const { price } = await getStockPrice(item.symbol);
        return {
          ...item.toJSON(),
          currentPrice: price
        };
      } catch (error) {
        console.error(`Error fetching price for ${item.symbol}:`, error);
        return {
          ...item.toJSON(),
          currentPrice: null
        };
      }
    }));

    console.log('Watchlist with prices:', watchlistWithPrices);
    res.json(watchlistWithPrices);
  } catch (error) {
    console.error('Error in getWatchlist:', error);
    res.status(500).json({ message: 'Failed to fetch watchlist', error: error.message });
  }
};

const removeFromWatchlist = async (req, res) => {
  try {
    const { id } = req.params;
    const watchlistItem = await WatchlistItem.findOne({ where: { id, userId: req.user.id } });
    if (!watchlistItem) {
      return res.status(404).json({ message: 'Watchlist item not found' });
    }
    await watchlistItem.destroy();
    res.json({ message: 'Item removed from watchlist successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove item from watchlist', error: error.message });
  }
};

const updateWatchlistAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const { alertPrice, alertType } = req.body;
    const watchlistItem = await WatchlistItem.findOne({ where: { id, userId: req.user.id } });
    if (!watchlistItem) {
      return res.status(404).json({ message: 'Watchlist item not found' });
    }
    await watchlistItem.update({ alertPrice, alertType });
    res.json(watchlistItem);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update watchlist alert', error: error.message });
  }
};

const getWatchlistRecommendations = async (req, res) => {
  try {
    const watchlistItems = await WatchlistItem.findAll({ where: { userId: req.user.id } });
    const watchlistData = await Promise.all(watchlistItems.map(async (item) => {
      const { price } = await getStockPrice(item.symbol);
      return {
        symbol: item.symbol,
        name: item.name,
        currentPrice: price,
      };
    }));

    const recommendations = await getInvestmentRecommendations(watchlistData, req.user.preferences);
    res.json({ recommendations, watchlist: watchlistData });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get watchlist recommendations', error: error.message });
  }
};

module.exports = {
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist,
  updateWatchlistAlert,
  getWatchlistRecommendations
};