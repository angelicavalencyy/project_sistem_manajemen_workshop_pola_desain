const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('ActivityLog', {
    actorUserId: { type: DataTypes.INTEGER, allowNull: false },
    taskId: { type: DataTypes.INTEGER },
    boardId: { type: DataTypes.INTEGER },
    action: { type: DataTypes.STRING(20), allowNull: false },
    description: { type: DataTypes.STRING(255), allowNull: false },
    oldValue: { type: DataTypes.JSONB },
    newValue: { type: DataTypes.JSONB },
  }, { tableName: 'activity_logs', updatedAt: false });
