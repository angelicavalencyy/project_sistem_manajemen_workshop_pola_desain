'use strict';

// Riwayat ekspor laporan (Strategy: csv/pdf/json).
module.exports = {
  async up(queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;

    await queryInterface.createTable('export_history', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      requested_by: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
      format: { type: DataTypes.STRING(20), allowNull: false, references: { model: 'export_format', key: 'code' } },
      file_name: { type: DataTypes.STRING(255), allowNull: false },
      row_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'completed', references: { model: 'export_status', key: 'code' } },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });

    await queryInterface.addIndex('export_history', ['requested_by', 'created_at']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('export_history');
  },
};
