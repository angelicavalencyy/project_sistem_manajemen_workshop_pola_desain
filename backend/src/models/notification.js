const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('Notification', {
    recipientUserId: { type: DataTypes.INTEGER, allowNull: false },
    taskId: { type: DataTypes.INTEGER },
    channel: { type: DataTypes.STRING(20), allowNull: false },
    title: { type: DataTypes.STRING(150), allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    isRead: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    sentAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    readAt: { type: DataTypes.DATE },
  }, { tableName: 'notifications', timestamps: false });
