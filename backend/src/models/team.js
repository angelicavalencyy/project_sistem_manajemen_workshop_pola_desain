const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('Team', {
    teamName: { type: DataTypes.STRING(100), allowNull: false },
    description: { type: DataTypes.STRING(255) },
    ownerId: { type: DataTypes.INTEGER, allowNull: false },
  }, { tableName: 'teams', updatedAt: false });
