const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('NotificationPreference', {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    channel: { type: DataTypes.STRING(20), allowNull: false },
    isEnabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  }, { tableName: 'notification_preferences', createdAt: false });
