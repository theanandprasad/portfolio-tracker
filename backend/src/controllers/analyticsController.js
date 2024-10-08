const { Investment, UserPreference, WatchlistItem } = require('../models');
const { getStockPrice } = require('../services/financialApiService');
const { getInvestmentRecommendations } = require('../services/openAIService');
const { getPerformanceMetrics } = require('../services/performanceMetricsService');

const getPortfolioSummary = async (req, res) => {
  console.log('Inside getPortfolioSummary controller');
  try {
    const investments = await Investment.findAll({ where: { userId: req.user.id } });
    
    if (investments.length === 0) {
      return res.json(null);
    }

    let totalValue = 0;
    let totalCost = 0;

    const updatedInvestments = investments.map(investment => {
      const currentValue = investment.currentPrice * investment.quantity;
      const cost = investment.purchasePrice * investment.quantity;
      
      totalValue += currentValue;
      totalCost += cost;

      return {
        ...investment.toJSON(),
        currentValue,
        profit: currentValue - cost
      };
    });

    const summary = {
      totalValue,
      totalCost,
      totalProfit: totalValue - totalCost,
      profitPercentage: ((totalValue - totalCost) / totalCost) * 100,
      investments: updatedInvestments
    };

    res.json(summary);
  } catch (error) {
    console.error('Error in getPortfolioSummary:', error);
    res.status(500).json({ message: 'Failed to fetch portfolio summary', error: error.message });
  }
};

const getAssetAllocation = async (req, res) => {
  console.log('getAssetAllocation called');
  try {
    const investments = await Investment.findAll({ where: { userId: req.user.id } });
    console.log('Investments found:', investments.length);
    
    if (investments.length === 0) {
      console.log('No investments found');
      return res.json([]); // Return an empty array instead of 404
    }

    const allocation = {};
    let totalValue = 0;

    await Promise.all(investments.map(async (investment) => {
      const stockData = await getStockPrice(investment.symbol);
      console.log('Stock data for', investment.symbol, ':', stockData);
      if (stockData && stockData.price) {
        const value = stockData.price * investment.quantity;
        totalValue += value;

        if (allocation[investment.type]) {
          allocation[investment.type] += value;
        } else {
          allocation[investment.type] = value;
        }
      } else {
        console.warn(`No price data available for ${investment.symbol}`);
      }
    }));

    console.log('Total value:', totalValue);
    console.log('Allocation:', allocation);

    if (totalValue === 0) {
      return res.status(404).json({ message: 'No valid investments found' });
    }

    const allocationPercentages = Object.entries(allocation).map(([type, value]) => ({
      type,
      value,
      percentage: (value / totalValue) * 100
    }));

    console.log('Allocation percentages:', allocationPercentages);
    res.json(allocationPercentages);
  } catch (error) {
    console.error('Error in getAssetAllocation:', error);
    res.status(500).json({ message: 'Failed to fetch asset allocation', error: error.message });
  }
};

const getAIRecommendations = async (req, res) => {
  try {
    console.log('Fetching AI recommendations for user:', req.user.id);
    const investments = await Investment.findAll({ where: { userId: req.user.id } });
    const userPreferences = await UserPreference.findOne({ where: { userId: req.user.id } });
    const watchlistItems = await WatchlistItem.findAll({ where: { userId: req.user.id } });

    if (!userPreferences) {
      console.log('User preferences not set for user:', req.user.id);
      return res.status(400).json({ message: 'User preferences not set' });
    }

    const portfolio = await Promise.all(investments.map(async (investment) => {
      const stockData = await getStockPrice(investment.symbol);
      if (!stockData) {
        console.log(`No stock data available for ${investment.symbol}`);
        return null;
      }
      return {
        symbol: investment.symbol,
        name: investment.name,
        type: investment.type,
        quantity: investment.quantity,
        currentPrice: stockData.price,
        purchasePrice: investment.purchasePrice,
        performancePercentage: ((stockData.price - investment.purchasePrice) / investment.purchasePrice) * 100
      };
    }));

    const validPortfolio = portfolio.filter(item => item !== null);

    const watchlist = watchlistItems.map(item => ({
      symbol: item.symbol,
      name: item.name
    }));

    console.log('Calling getInvestmentRecommendations with:', { portfolio: validPortfolio, userPreferences, watchlist });
    const recommendations = await getInvestmentRecommendations(validPortfolio, userPreferences, watchlist);
    console.log('Recommendations received:', recommendations);
    res.json({ recommendations, portfolio: validPortfolio, watchlist });
  } catch (error) {
    console.error('Error in getAIRecommendations:', error);
    res.status(500).json({ message: 'Failed to get AI recommendations', error: error.message });
  }
};

const getPortfolioPerformance = async (req, res) => {
  try {
    const performanceMetrics = await getPerformanceMetrics(req.user.id);
    res.json(performanceMetrics);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch portfolio performance metrics', error: error.message });
  }
};

module.exports = {
  getPortfolioSummary,
  getAssetAllocation,
  getAIRecommendations,
  getPortfolioPerformance
};