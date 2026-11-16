// Repository notifikasi berbasis Sequelize (tabel: notifications, notification_preferences).
const { Notification, NotificationPreference } = require('../../models');
const { CHANNELS } = require('./strategies');

const DEFAULT_CHANNELS = [CHANNELS.IN_APP];

class NotificationRepository {
  /** Channel aktif user. Jika user belum pernah mengatur preferensi, pakai in-app. */
  async getEnabledChannels(userId) {
    const prefs = await NotificationPreference.findAll({ where: { userId } });
    if (prefs.length === 0) return DEFAULT_CHANNELS;
    return prefs.filter((p) => p.isEnabled).map((p) => p.channel);
  }

  /** Simpan preferensi channel. Channel yang tidak ada di daftar dinonaktifkan. */
  async setEnabledChannels(userId, channels) {
    const enabled = new Set(channels);
    await NotificationPreference.bulkCreate(
      Object.values(CHANNELS).map((channel) => ({
        userId,
        channel,
        isEnabled: enabled.has(channel),
      })),
      { updateOnDuplicate: ['isEnabled', 'updatedAt'] },
    );
  }

  async save({ recipientUserId, taskId, channel, title, message }) {
    const record = await Notification.create({ recipientUserId, taskId, channel, title, message });
    return record.toJSON();
  }

  async findByRecipient(userId) {
    const rows = await Notification.findAll({
      where: { recipientUserId: userId },
      order: [['sentAt', 'DESC']],
    });
    return rows.map((r) => r.toJSON());
  }

  async markRead(id) {
    const record = await Notification.findByPk(id);
    if (!record) return null;
    await record.update({ isRead: true, readAt: new Date() });
    return record.toJSON();
  }
}

module.exports = NotificationRepository;
