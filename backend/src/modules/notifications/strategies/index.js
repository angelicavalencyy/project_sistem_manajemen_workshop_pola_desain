// Kode channel -> strategi. Tambah channel baru di sini saja.
const InAppStrategy = require('./InAppStrategy');
const EmailStrategy = require('./EmailStrategy');
const PushNotificationStrategy = require('./PushNotificationStrategy');

const CHANNELS = Object.freeze({
  IN_APP: 'in_app',
  EMAIL: 'email',
  PUSH: 'push',
});

function createStrategies() {
  return {
    [CHANNELS.IN_APP]: new InAppStrategy(),
    [CHANNELS.EMAIL]: new EmailStrategy(),
    [CHANNELS.PUSH]: new PushNotificationStrategy(),
  };
}

module.exports = { CHANNELS, createStrategies };
