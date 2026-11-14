'use strict';

// Tabel users, teams, dan keanggotaan tim (N-N).
module.exports = {
  async up(queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;

    await queryInterface.createTable('users', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      full_name: { type: DataTypes.STRING(100), allowNull: false },
      email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
      password_hash: { type: DataTypes.STRING(255), allowNull: false },
      avatar_url: { type: DataTypes.STRING(255) },
      is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });

    await queryInterface.createTable('teams', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      team_name: { type: DataTypes.STRING(100), allowNull: false },
      description: { type: DataTypes.STRING(255) },
      owner_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });

    await queryInterface.createTable('team_members', {
      team_id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, references: { model: 'teams', key: 'id' } },
      user_id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, references: { model: 'users', key: 'id' } },
      role: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'member' },
      joined_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('team_members');
    await queryInterface.dropTable('teams');
    await queryInterface.dropTable('users');
  },
};
