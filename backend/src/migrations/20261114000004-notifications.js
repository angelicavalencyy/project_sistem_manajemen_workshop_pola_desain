'use strict';

// Notifikasi: preferensi per user (penentu Strategy) dan riwayat terkirim.
module.exports = {
  async up(queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;

    await queryInterface.createTable('notification_preferences', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
      channel: { type: DataTypes.STRING(20), allowNull: false, references: { model: 'notification_channel', key: 'code' } },
      is_enabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });

    await queryInterface.createTable('notifications', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      recipient_user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
      task_id: { type: DataTypes.INTEGER, references: { model: 'tasks', key: 'id' } },
      channel: { type: DataTypes.STRING(20), allowNull: false, references: { model: 'notification_channel', key: 'code' } },
      title: { type: DataTypes.STRING(150), allowNull: false },
      message: { type: DataTypes.TEXT, allowNull: false },
      is_read: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      sent_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      read_at: { type: DataTypes.DATE },
    });

    await queryInterface.addIndex('notification_preferences', ['user_id', 'channel'], { unique: true });
    await queryInterface.addIndex('notifications', ['recipient_user_id', 'is_read']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('notifications');
    await queryInterface.dropTable('notification_preferences');
  },
};
