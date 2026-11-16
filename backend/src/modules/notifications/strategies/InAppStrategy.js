const NotificationStrategy = require('./NotificationStrategy');

// Kanal in-app. Notifikasi disimpan ke tabel `notifications` dan dicatat ke console.
class InAppStrategy extends NotificationStrategy {
  async send(recipient, notification) {
    console.log(`[IN_APP] to user ${recipient.id} | ${notification.title} | ${notification.message}`);
    return { channel: 'in_app', delivered: true };
  }
}

module.exports = InAppStrategy;
