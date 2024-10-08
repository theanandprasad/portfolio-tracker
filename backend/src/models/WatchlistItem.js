const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const WatchlistItem = sequelize.define('WatchlistItem', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    symbol: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    alertPrice: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    alertType: {
      type: DataTypes.ENUM('above', 'below'),
      allowNull: true,
    },
  });

  return WatchlistItem;
};