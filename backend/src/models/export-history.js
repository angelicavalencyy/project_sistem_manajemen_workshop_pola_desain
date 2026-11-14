const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('ExportHistory', {
    requestedBy: { type: DataTypes.INTEGER, allowNull: false },
    format: { type: DataTypes.STRING(20), allowNull: false },
    fileName: { type: DataTypes.STRING(255), allowNull: false },
    rowCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'completed' },
  }, { tableName: 'export_history', updatedAt: false });
