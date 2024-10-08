const { sequelize } = require('../config/db');
const UserModel = require('./User');
const InvestmentModel = require('./Investment');
const UserPreferenceModel = require('./UserPreference');
const AlertModel = require('./Alert');
const WatchlistItemModel = require('./WatchlistItem');

const User = UserModel(sequelize);
const Investment = InvestmentModel(sequelize);
const UserPreference = UserPreferenceModel(sequelize);
const Alert = AlertModel(sequelize);
const WatchlistItem = WatchlistItemModel(sequelize);

// Define associations
User.hasMany(Investment, { foreignKey: 'userId' });
Investment.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(UserPreference, { foreignKey: 'userId' });
UserPreference.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Alert, { foreignKey: 'userId' });
Alert.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(WatchlistItem, { foreignKey: 'userId' });
WatchlistItem.belongsTo(User, { foreignKey: 'userId' });

const syncDatabase = async () => {
  await sequelize.sync({ alter: true });
  console.log('Database synced');
};

module.exports = {
  sequelize,
  User,
  Investment,
  UserPreference,
  Alert,
  WatchlistItem,
  syncDatabase
};