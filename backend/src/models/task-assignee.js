const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('TaskAssignee', {
    taskId: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
    isPrimary: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    assignedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  }, { tableName: 'task_assignees', timestamps: false });
