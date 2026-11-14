const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('TeamMember', {
    teamId: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
    role: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'member' },
    joinedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  }, { tableName: 'team_members', timestamps: false });
