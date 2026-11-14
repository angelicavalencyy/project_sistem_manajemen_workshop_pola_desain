'use strict';

// Papan Kanban: boards, board_columns, tasks (dengan soft delete), task_assignees.
module.exports = {
  async up(queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;

    await queryInterface.createTable('boards', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      team_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'teams', key: 'id' } },
      owner_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
      board_name: { type: DataTypes.STRING(100), allowNull: false },
      description: { type: DataTypes.STRING(255) },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });

    await queryInterface.createTable('board_columns', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      board_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'boards', key: 'id' } },
      name: { type: DataTypes.STRING(50), allowNull: false },
      position: { type: DataTypes.INTEGER, allowNull: false },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });

    await queryInterface.createTable('tasks', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      board_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'boards', key: 'id' } },
      column_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'board_columns', key: 'id' } },
      title: { type: DataTypes.STRING(150), allowNull: false },
      description: { type: DataTypes.TEXT },
      priority: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'medium', references: { model: 'task_priority', key: 'code' } },
      deadline: { type: DataTypes.DATE },
      position: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      created_by: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      deleted_at: { type: DataTypes.DATE },
    });

    await queryInterface.createTable('task_assignees', {
      task_id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, references: { model: 'tasks', key: 'id' } },
      user_id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, references: { model: 'users', key: 'id' } },
      is_primary: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      assigned_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });

    await queryInterface.addIndex('board_columns', ['board_id', 'position']);
    await queryInterface.addIndex('tasks', ['board_id', 'column_id', 'position']);
    await queryInterface.addIndex('tasks', ['deadline']);
    await queryInterface.addIndex('tasks', ['priority']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('task_assignees');
    await queryInterface.dropTable('tasks');
    await queryInterface.dropTable('board_columns');
    await queryInterface.dropTable('boards');
  },
};
