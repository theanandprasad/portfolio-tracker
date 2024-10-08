const cron = require('node-cron');
const { Investment } = require('../models');
const { getStockPrice } = require('../services/financialApiService');

async function updatePrices() {
  console.log('Starting price update job');
  try {
    const investments = await Investment.findAll();
    const uniqueSymbols = [...new Set(investments.map(inv => inv.symbol))];
    
    for (const symbol of uniqueSymbols) {
      await getStockPrice(symbol); // This will update the cache
    }
    
    console.log('Price update job completed successfully');
  } catch (error) {
    console.error('Error in price update job:', error);
  }
}

function schedulePriceUpdates() {
  // Run the job every day at 1:00 AM
  cron.schedule('0 1 * * *', updatePrices);
}

module.exports = { schedulePriceUpdates };