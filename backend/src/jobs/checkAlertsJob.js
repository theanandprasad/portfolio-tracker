const cron = require('node-cron');
const { Alert, WatchlistItem, User } = require('../models');
const { getStockPrice } = require('../services/financialApiService');
const { sendNotification } = require('../services/notificationService');
const { Op } = require('sequelize');

async function checkAlerts() {
  console.log('Starting alert check job');
  try {
    const alerts = await Alert.findAll({ where: { isTriggered: false }, include: [User] });
    for (const alert of alerts) {
      const { price } = await getStockPrice(alert.symbol);
      if ((alert.alertType === 'above' && price >= alert.targetPrice) ||
          (alert.alertType === 'below' && price <= alert.targetPrice)) {
        await alert.update({ isTriggered: true });
        
        const notificationPayload = {
          title: 'Price Alert Triggered',
          body: `${alert.symbol} has reached your target price of ${alert.targetPrice}`,
          icon: '/path/to/icon.png',
          data: { url: '/portfolio' }
        };
        await sendNotification(alert.userId, notificationPayload);
        
        console.log(`Alert triggered for ${alert.symbol}: Current price ${price}, Target price ${alert.targetPrice}`);
      }
    }

    const watchlistItems = await WatchlistItem.findAll({ where: { alertPrice: { [Op.ne]: null } }, include: [User] });
    for (const item of watchlistItems) {
      const { price } = await getStockPrice(item.symbol);
      if ((item.alertType === 'above' && price >= item.alertPrice) ||
          (item.alertType === 'below' && price <= item.alertPrice)) {
        const notificationPayload = {
          title: 'Watchlist Alert Triggered',
          body: `${item.symbol} has reached your alert price of ${item.alertPrice}`,
          icon: '/path/to/icon.png',
          data: { url: '/watchlist' }
        };
        await sendNotification(item.userId, notificationPayload);
        
        console.log(`Watchlist alert triggered for ${item.symbol}: Current price ${price}, Alert price ${item.alertPrice}`);
      }
    }

    console.log('Alert check job completed successfully');
  } catch (error) {
    console.error('Error in alert check job:', error);
  }
}

function scheduleAlertChecks() {
  // Run the job every 15 minutes
  cron.schedule('*/15 * * * *', checkAlerts);
}

module.exports = { scheduleAlertChecks };