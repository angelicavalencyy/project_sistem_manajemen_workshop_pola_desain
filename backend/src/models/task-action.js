const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('TaskAction', {
    code: { type: DataTypes.STRING(20), primaryKey: true },
    label: { type: DataTypes.STRING(50), allowNull: false },
  }, { tableName: 'task_action', timestamps: false });
