const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Alert = sequelize.define('Alert', {
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
    targetPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    alertType: {
      type: DataTypes.ENUM('above', 'below'),
      allowNull: false,
    },
    isTriggered: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  return Alert;
};