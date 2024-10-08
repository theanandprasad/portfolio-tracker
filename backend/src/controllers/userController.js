const { User } = require('../models');
const { subscribe, unsubscribe, vapidKeys } = require('../services/notificationService');

const getProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).send(error);
  }
};

const subscribeNotifications = async (req, res) => {
  try {
    const subscription = req.body;
    subscribe(req.user.id, subscription);
    res.status(201).json({ message: 'Subscribed to notifications' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to subscribe to notifications', error: error.message });
  }
};

const unsubscribeNotifications = async (req, res) => {
  try {
    unsubscribe(req.user.id);
    res.json({ message: 'Unsubscribed from notifications' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to unsubscribe from notifications', error: error.message });
  }
};

const getVapidPublicKey = (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
};

module.exports = {
  getProfile,
  subscribeNotifications,
  unsubscribeNotifications,
  getVapidPublicKey
};