'use strict';

// Jejak audit aktivitas (Observer): siapa melakukan apa dan kapan.
module.exports = {
  async up(queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;

    await queryInterface.createTable('activity_logs', {
      id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
      actor_user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
      task_id: { type: DataTypes.INTEGER, references: { model: 'tasks', key: 'id' } },
      board_id: { type: DataTypes.INTEGER, references: { model: 'boards', key: 'id' } },
      action: { type: DataTypes.STRING(20), allowNull: false, references: { model: 'task_action', key: 'code' } },
      description: { type: DataTypes.STRING(255), allowNull: false },
      old_value: { type: DataTypes.JSON },
      new_value: { type: DataTypes.JSON },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });

    await queryInterface.addIndex('activity_logs', ['created_at']);
    await queryInterface.addIndex('activity_logs', ['board_id', 'created_at']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('activity_logs');
  },
};
