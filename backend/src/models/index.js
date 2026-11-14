const sequelize = require('../config/database');

const db = {
  sequelize,

  // Tabel referensi
  TaskPriority: require('./task-priority')(sequelize),
  TaskAction: require('./task-action')(sequelize),
  NotificationChannel: require('./notification-channel')(sequelize),
  ExportFormat: require('./export-format')(sequelize),
  ExportStatus: require('./export-status')(sequelize),

  // Tabel utama
  User: require('./user')(sequelize),
  Team: require('./team')(sequelize),
  TeamMember: require('./team-member')(sequelize),
  Board: require('./board')(sequelize),
  BoardColumn: require('./board-column')(sequelize),
  Task: require('./task')(sequelize),
  TaskAssignee: require('./task-assignee')(sequelize),
  NotificationPreference: require('./notification-preference')(sequelize),
  Notification: require('./notification')(sequelize),
  ActivityLog: require('./activity-log')(sequelize),
  ExportHistory: require('./export-history')(sequelize),
};

const { Team, TeamMember, Board, BoardColumn, Task, TaskAssignee,
  Notification, NotificationPreference, ActivityLog, ExportHistory, User } = db;

// users <-> teams
Team.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });
Team.belongsToMany(User, { through: TeamMember, as: 'members', foreignKey: 'teamId' });
User.belongsToMany(Team, { through: TeamMember, as: 'teams', foreignKey: 'userId' });
TeamMember.belongsTo(Team, { foreignKey: 'teamId' });
TeamMember.belongsTo(User, { foreignKey: 'userId' });

// boards
Board.belongsTo(Team, { foreignKey: 'teamId' });
Board.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });
Board.hasMany(BoardColumn, { as: 'columns', foreignKey: 'boardId' });
BoardColumn.belongsTo(Board, { foreignKey: 'boardId' });

// tasks
Task.belongsTo(Board, { foreignKey: 'boardId' });
Task.belongsTo(BoardColumn, { as: 'column', foreignKey: 'columnId' });
Task.belongsTo(User, { as: 'creator', foreignKey: 'createdBy' });
Board.hasMany(Task, { foreignKey: 'boardId' });
BoardColumn.hasMany(Task, { foreignKey: 'columnId' });

Task.belongsToMany(User, { through: TaskAssignee, as: 'assignees', foreignKey: 'taskId' });
User.belongsToMany(Task, { through: TaskAssignee, as: 'assignedTasks', foreignKey: 'userId' });
TaskAssignee.belongsTo(Task, { foreignKey: 'taskId' });
TaskAssignee.belongsTo(User, { foreignKey: 'userId' });

// notifications
Notification.belongsTo(User, { as: 'recipient', foreignKey: 'recipientUserId' });
Notification.belongsTo(Task, { foreignKey: 'taskId' });
NotificationPreference.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(NotificationPreference, { foreignKey: 'userId' });
User.hasMany(Notification, { as: 'notifications', foreignKey: 'recipientUserId' });

// activity logs & export history
ActivityLog.belongsTo(User, { as: 'actor', foreignKey: 'actorUserId' });
ActivityLog.belongsTo(Task, { foreignKey: 'taskId' });
ActivityLog.belongsTo(Board, { foreignKey: 'boardId' });
ExportHistory.belongsTo(User, { as: 'requester', foreignKey: 'requestedBy' });
User.hasMany(ActivityLog, { foreignKey: 'actorUserId' });
User.hasMany(ExportHistory, { foreignKey: 'requestedBy' });

module.exports = db;
