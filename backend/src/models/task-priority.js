const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('TaskPriority', {
    code: { type: DataTypes.STRING(20), primaryKey: true },
    label: { type: DataTypes.STRING(50), allowNull: false },
    sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  }, { tableName: 'task_priority', timestamps: false });
