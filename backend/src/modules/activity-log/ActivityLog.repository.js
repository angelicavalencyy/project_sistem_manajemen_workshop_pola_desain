// Repository activity log berbasis Sequelize (tabel: activity_logs, board_columns).
// Disesuaikan dengan model tim: kolom `action`, `oldValue`, `newValue`, dan `createdAt`.
const { ActivityLog, BoardColumn } = require('../../models');

class ActivityLogRepository {
  async save({ actorUserId, taskId, boardId, action, description, oldValue, newValue }) {
    const record = await ActivityLog.create({
      actorUserId,
      taskId: taskId ?? null,
      boardId: boardId ?? null,
      action,
      description,
      oldValue: oldValue ?? null,
      newValue: newValue ?? null,
    });
    return record.toJSON();
  }

  /** Nama tab/kolom papan (mis. "Done") dari columnId. Null jika tidak ditemukan. */
  async findColumnName(columnId) {
    if (columnId == null) return null;
    const column = await BoardColumn.findByPk(columnId, { attributes: ['name'] });
    return column ? column.name : null;
  }

  /** Filter opsional: taskId, boardId, actorUserId. Terbaru dulu, dengan pagination. */
  async findAll({ taskId, boardId, actorUserId, limit = 20, offset = 0 } = {}) {
    const where = {};
    if (taskId) where.taskId = taskId;
    if (boardId) where.boardId = boardId;
    if (actorUserId) where.actorUserId = actorUserId;

    const { rows, count } = await ActivityLog.findAndCountAll({
      where,
      order: [['createdAt', 'DESC'], ['id', 'DESC']],
      limit,
      offset,
    });
    return { total: count, items: rows.map((r) => r.toJSON()) };
  }
}

module.exports = ActivityLogRepository;