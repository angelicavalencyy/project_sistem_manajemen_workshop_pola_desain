'use strict';

// Tabel referensi (lookup) + data awalnya. Dipakai sebagai FK oleh tabel lain.
module.exports = {
  async up(queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;

    await queryInterface.createTable('task_priority', {
      code: { type: DataTypes.STRING(20), primaryKey: true },
      label: { type: DataTypes.STRING(50), allowNull: false },
      sort_order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    });

    await queryInterface.createTable('task_action', {
      code: { type: DataTypes.STRING(20), primaryKey: true },
      label: { type: DataTypes.STRING(50), allowNull: false },
    });

    await queryInterface.createTable('notification_channel', {
      code: { type: DataTypes.STRING(20), primaryKey: true },
      label: { type: DataTypes.STRING(50), allowNull: false },
    });

    await queryInterface.createTable('export_format', {
      code: { type: DataTypes.STRING(20), primaryKey: true },
      label: { type: DataTypes.STRING(50), allowNull: false },
    });

    await queryInterface.createTable('export_status', {
      code: { type: DataTypes.STRING(20), primaryKey: true },
      label: { type: DataTypes.STRING(50), allowNull: false },
    });

    await queryInterface.bulkInsert('task_priority', [
      { code: 'high', label: 'Prioritas tinggi', sort_order: 1 },
      { code: 'medium', label: 'Prioritas sedang', sort_order: 2 },
      { code: 'low', label: 'Prioritas rendah', sort_order: 3 },
    ]);

    await queryInterface.bulkInsert('task_action', [
      { code: 'created', label: 'Tugas dibuat' },
      { code: 'updated', label: 'Tugas diedit' },
      { code: 'deleted', label: 'Tugas dihapus (soft delete)' },
      { code: 'moved', label: 'Status berpindah kolom' },
    ]);

    await queryInterface.bulkInsert('notification_channel', [
      { code: 'email', label: 'EmailStrategy (simulasi)' },
      { code: 'in_app', label: 'InAppStrategy (lonceng/pop-up)' },
      { code: 'push', label: 'PushNotificationStrategy' },
    ]);

    await queryInterface.bulkInsert('export_format', [
      { code: 'csv', label: 'ExportToCSV' },
      { code: 'pdf', label: 'ExportToPDF' },
      { code: 'json', label: 'ExportToJSON' },
    ]);

    await queryInterface.bulkInsert('export_status', [
      { code: 'pending', label: 'Sedang diproses' },
      { code: 'completed', label: 'Selesai' },
      { code: 'failed', label: 'Gagal' },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('export_status');
    await queryInterface.dropTable('export_format');
    await queryInterface.dropTable('notification_channel');
    await queryInterface.dropTable('task_action');
    await queryInterface.dropTable('task_priority');
  },
};
