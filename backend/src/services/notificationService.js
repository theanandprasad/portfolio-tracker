const webpush = require('web-push');

webpush.setVapidDetails(
  `mailto:${process.env.VAPID_EMAIL}`,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Store subscriptions (in a real app, you'd store these in a database)
const subscriptions = new Map();

const subscribe = (userId, subscription) => {
  subscriptions.set(userId, subscription);
};

const unsubscribe = (userId) => {
  subscriptions.delete(userId);
};

const sendNotification = async (userId, payload) => {
  const subscription = subscriptions.get(userId);
  if (subscription) {
    try {
      await webpush.sendNotification(subscription, JSON.stringify(payload));
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }
};

module.exports = { subscribe, unsubscribe, sendNotification };