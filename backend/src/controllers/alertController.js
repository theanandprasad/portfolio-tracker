const { Alert } = require('../models');

const createAlert = async (req, res) => {
  try {
    const { symbol, targetPrice, alertType } = req.body;
    const alert = await Alert.create({
      userId: req.user.id,
      symbol,
      targetPrice,
      alertType,
    });
    res.status(201).json(alert);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create alert', error: error.message });
  }
};

const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.findAll({ where: { userId: req.user.id } });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch alerts', error: error.message });
  }
};

const deleteAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const alert = await Alert.findOne({ where: { id, userId: req.user.id } });
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    await alert.destroy();
    res.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete alert', error: error.message });
  }
};

module.exports = { createAlert, getAlerts, deleteAlert };