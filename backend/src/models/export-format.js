const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define('ExportFormat', {
    code: { type: DataTypes.STRING(20), primaryKey: true },
    label: { type: DataTypes.STRING(50), allowNull: false },
  }, { tableName: 'export_format', timestamps: false });
