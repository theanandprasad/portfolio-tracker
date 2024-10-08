const { Investment } = require('../models');
const { getHistoricalPrices } = require('../services/financialApiService');

const getPortfolioPerformance = async (req, res) => {
  try {
    const investments = await Investment.findAll({ where: { userId: req.user.id } });
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const performanceData = await Promise.all(investments.map(async (investment) => {
      const historicalPrices = await getHistoricalPrices(investment.symbol, startDate, endDate);
      return {
        symbol: investment.symbol,
        name: investment.name,
        data: historicalPrices.map(({ date, price }) => ({
          date,
          value: price * investment.quantity
        }))
      };
    }));

    res.json(performanceData);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch portfolio performance data', error: error.message });
  }
};

const getAssetAllocationData = async (req, res) => {
  try {
    const investments = await Investment.findAll({ where: { userId: req.user.id } });
    const allocation = investments.reduce((acc, investment) => {
      const value = investment.currentPrice * investment.quantity;
      acc[investment.type] = (acc[investment.type] || 0) + value;
      return acc;
    }, {});

    const totalValue = Object.values(allocation).reduce((sum, value) => sum + value, 0);
    const allocationData = Object.entries(allocation).map(([type, value]) => ({
      type,
      value,
      percentage: (value / totalValue) * 100
    }));

    res.json(allocationData);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch asset allocation data', error: error.message });
  }
};

module.exports = {
  getPortfolioPerformance,
  getAssetAllocationData
};