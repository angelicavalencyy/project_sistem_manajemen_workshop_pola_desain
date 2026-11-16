const NotificationStrategy = require('./NotificationStrategy');

// Kanal email. Pengiriman dicatat ke console sebagai bukti strategi terpanggil.
class EmailStrategy extends NotificationStrategy {
  async send(recipient, notification) {
    console.log(`[EMAIL] to user ${recipient.id} | ${notification.title} | ${notification.message}`);
    return { channel: 'email', delivered: true };
  }
}

module.exports = EmailStrategy;
