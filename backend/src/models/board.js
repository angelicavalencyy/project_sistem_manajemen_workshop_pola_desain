const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('Board', {
    teamId: { type: DataTypes.INTEGER, allowNull: false },
    ownerId: { type: DataTypes.INTEGER, allowNull: false },
    boardName: { type: DataTypes.STRING(100), allowNull: false },
    description: { type: DataTypes.STRING(255) },
  }, { tableName: 'boards', updatedAt: false });
