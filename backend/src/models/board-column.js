const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('BoardColumn', {
    boardId: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING(50), allowNull: false },
    position: { type: DataTypes.INTEGER, allowNull: false },
  }, { tableName: 'board_columns', updatedAt: false });
