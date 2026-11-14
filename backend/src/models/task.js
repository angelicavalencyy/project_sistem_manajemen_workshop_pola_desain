const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('Task', {
    boardId: { type: DataTypes.INTEGER, allowNull: false },
    columnId: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING(150), allowNull: false },
    description: { type: DataTypes.TEXT },
    priority: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'medium' },
    deadline: { type: DataTypes.DATE },
    position: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    createdBy: { type: DataTypes.INTEGER, allowNull: false },
  }, { tableName: 'tasks', paranoid: true });
