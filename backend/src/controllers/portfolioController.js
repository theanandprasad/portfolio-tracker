const { Investment } = require('../models');
const { getStockPrice } = require('../services/financialApiService');

const addInvestment = async (req, res) => {
  try {
    console.log('Add Investment - Request body:', req.body);
    console.log('Add Investment - User:', req.user);

    const { symbol, name, type, purchaseDate, quantity, purchasePrice } = req.body;
    const investment = await Investment.create({
      userId: req.user.id,
      symbol,
      name,
      type,
      purchaseDate,
      quantity,
      purchasePrice,
    });
    console.log('Add Investment - Created investment:', investment);
    res.status(201).json(investment);
  } catch (error) {
    console.error('Add Investment - Error:', error);
    res.status(400).json({ message: 'Failed to add investment', error: error.message });
  }
};

const getInvestments = async (req, res) => {
  try {
    const investments = await Investment.findAll({ where: { userId: req.user.id } });
    res.json(investments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch investments', error: error.message });
  }
};

const updateInvestment = async (req, res) => {
  try {
    const { id } = req.params;
    const { symbol, name, type, purchaseDate, quantity, purchasePrice } = req.body;
    const investment = await Investment.findOne({ where: { id, userId: req.user.id } });
    
    if (!investment) {
      return res.status(404).json({ message: 'Investment not found' });
    }
    
    await investment.update({ symbol, name, type, purchaseDate, quantity, purchasePrice });
    res.json(investment);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update investment', error: error.message });
  }
};

const deleteInvestment = async (req, res) => {
  try {
    const { id } = req.params;
    const investment = await Investment.findOne({ where: { id, userId: req.user.id } });
    
    if (!investment) {
      return res.status(404).json({ message: 'Investment not found' });
    }
    
    await investment.destroy();
    res.json({ message: 'Investment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete investment', error: error.message });
  }
};

const getCurrentPrices = async (req, res) => {
  try {
    const investments = await Investment.findAll({ where: { userId: req.user.id } });
    const currentPrices = await Promise.all(
      investments.map(async (investment) => {
        const { price } = await getStockPrice(investment.symbol);
        return {
          id: investment.id,
          symbol: investment.symbol,
          currentPrice: price,
          purchasePrice: investment.purchasePrice,
          quantity: investment.quantity,
          totalValue: price * investment.quantity,
          profit: (price - investment.purchasePrice) * investment.quantity
        };
      })
    );
    res.json(currentPrices);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch current prices', error: error.message });
  }
};

const getInvestmentHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;
    const investment = await Investment.findOne({ where: { id, userId: req.user.id } });
    
    if (!investment) {
      return res.status(404).json({ message: 'Investment not found' });
    }
    
    const historicalPrices = await getHistoricalPrices(investment.symbol, startDate, endDate);
    res.json({
      investment,
      historicalPrices
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch investment history', error: error.message });
  }
};

const getRecentActivities = async (req, res) => {
  try {
    // This is a placeholder implementation. You'll need to adjust this based on your data model and requirements.
    const activities = await Investment.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: 10 // Adjust this number as needed
    });

    const formattedActivities = activities.map(activity => ({
      id: activity.id,
      description: `${activity.type} ${activity.symbol} - ${activity.quantity} shares at $${activity.purchasePrice}`,
      date: activity.createdAt
    }));

    res.json(formattedActivities);
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    res.status(500).json({ message: 'Failed to fetch recent activities', error: error.message });
  }
};

module.exports = {
  addInvestment,
  getInvestments,
  updateInvestment,
  deleteInvestment,
  getCurrentPrices,
  getInvestmentHistory,
  getRecentActivities
};