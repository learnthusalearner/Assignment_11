const notifications = {};

function sendInApp({ userId, message }) {
  if (!userId) throw new Error('User ID is required');
  if (!notifications[userId]) notifications[userId] = [];
  notifications[userId].push({ message, timestamp: Date.now() });
}

function getUserNotifications(userId) {
  return notifications[userId] || [];
}

module.exports = { sendInApp, getUserNotifications };
