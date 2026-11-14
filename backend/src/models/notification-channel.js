const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('NotificationChannel', {
    code: { type: DataTypes.STRING(20), primaryKey: true },
    label: { type: DataTypes.STRING(50), allowNull: false },
  }, { tableName: 'notification_channel', timestamps: false });
