const NotificationStrategy = require('./NotificationStrategy');

// Kanal push. Pengiriman dicatat ke console sebagai bukti strategi terpanggil.
class PushNotificationStrategy extends NotificationStrategy {
  async send(recipient, notification) {
    console.log(`[PUSH] to user ${recipient.id} | ${notification.title} | ${notification.message}`);
    return { channel: 'push', delivered: true };
  }
}

module.exports = PushNotificationStrategy;
