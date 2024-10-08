require('dotenv').config();
const app = require('./app');
const { sequelize, syncDatabase } = require('./models/index');
const { schedulePriceUpdates } = require('./jobs/updatePricesJob');
const { scheduleAlertChecks } = require('./jobs/checkAlertsJob');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    await syncDatabase();
    
    schedulePriceUpdates();
    scheduleAlertChecks();
    console.log('Price update and alert check jobs scheduled');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start the server:', error);
  }
}

startServer();