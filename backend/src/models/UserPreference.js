const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserPreference = sequelize.define('UserPreference', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
    },
    riskTolerance: {
      type: DataTypes.ENUM('low', 'moderate', 'high'),
      allowNull: false,
    },
    investmentGoals: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    investmentHorizon: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return UserPreference;
};