const { Investment } = require('../models');
const { getHistoricalPrices } = require('./financialApiService');

const calculateReturns = (initialValue, finalValue) => {
  return (finalValue - initialValue) / initialValue;
};

const calculateSharpeRatio = (returns, riskFreeRate = 0.02) => {
  const excessReturns = returns.map(r => r - riskFreeRate);
  const avgExcessReturn = excessReturns.reduce((sum, r) => sum + r, 0) / excessReturns.length;
  const stdDev = Math.sqrt(excessReturns.map(r => Math.pow(r - avgExcessReturn, 2)).reduce((sum, r) => sum + r, 0) / excessReturns.length);
  return avgExcessReturn / stdDev;
};

const calculateBeta = (stockReturns, marketReturns) => {
  const covariance = stockReturns.reduce((sum, r, i) => sum + (r - average(stockReturns)) * (marketReturns[i] - average(marketReturns)), 0) / stockReturns.length;
  const marketVariance = marketReturns.reduce((sum, r) => sum + Math.pow(r - average(marketReturns), 2), 0) / marketReturns.length;
  return covariance / marketVariance;
};

const average = (arr) => arr.reduce((sum, val) => sum + val, 0) / arr.length;

const getPerformanceMetrics = async (userId) => {
  const investments = await Investment.findAll({ where: { userId } });
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const performanceData = await Promise.all(investments.map(async (investment) => {
    const historicalPrices = await getHistoricalPrices(investment.symbol, startDate, endDate);
    const returns = historicalPrices.map((price, index, arr) => {
      if (index === 0) return 0;
      return calculateReturns(arr[index - 1].price, price.price);
    }).slice(1);

    // For simplicity, we're using S&P 500 as the market benchmark
    const marketPrices = await getHistoricalPrices('SPY', startDate, endDate);
    const marketReturns = marketPrices.map((price, index, arr) => {
      if (index === 0) return 0;
      return calculateReturns(arr[index - 1].price, price.price);
    }).slice(1);

    const sharpeRatio = calculateSharpeRatio(returns);
    const beta = calculateBeta(returns, marketReturns);

    return {
      symbol: investment.symbol,
      name: investment.name,
      sharpeRatio,
      beta,
      totalReturn: calculateReturns(historicalPrices[0].price, historicalPrices[historicalPrices.length - 1].price)
    };
  }));

  return performanceData;
};

module.exports = { getPerformanceMetrics };