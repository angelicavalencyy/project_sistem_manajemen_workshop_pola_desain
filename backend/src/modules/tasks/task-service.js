const db = require('../../models');
const taskManager = require('./task-manager');
const HttpError = require('./errors');

const { BoardColumn, Task, TaskAssignee, TaskPriority, User } = db;

// Field kartu yang boleh diubah lewat endpoint edit.
// Perpindahan kolom (status) punya endpoint sendiri karena memicu event berbeda.
const EDITABLE_FIELDS = ['title', 'description', 'priority', 'deadline'];

async function getTaskById(id) {
  return Task.findByPk(id, {
    include: [
      { association: 'creator', attributes: ['id', 'fullName'] },
      { association: 'assignees', through: { attributes: [] } },
    ],
  });
}

// Data papan Kanban: daftar kolom berurutan + kartu di dalamnya.
async function getBoardView(boardId) {
  const columns = await BoardColumn.findAll({
    where: { boardId },
    order: [['position', 'ASC']],
  });
  if (columns.length === 0) return null;

  const tasks = await Task.findAll({
    where: { boardId },
    order: [['position', 'ASC']],
    include: [
      { association: 'creator', attributes: ['id', 'fullName'] },
      { association: 'assignees', through: { attributes: [] } },
    ],
  });

  const tasksByColumn = new Map(columns.map((col) => [col.id, []]));
  for (const task of tasks) {
    tasksByColumn.get(task.columnId).push(task);
  }

  return columns.map((col) => ({
    id: col.id,
    name: col.name,
    position: col.position,
    tasks: tasksByColumn.get(col.id),
  }));
}

async function assertPriorityExists(priority) {
  if (priority === undefined) return;
  if (!(await TaskPriority.findByPk(priority))) {
    throw new HttpError(400, `Prioritas '${priority}' tidak dikenal`);
  }
}

async function createTask(payload) {
  if (!payload.boardId) throw new HttpError(400, 'boardId wajib diisi');
  if (!payload.title || !payload.title.trim()) throw new HttpError(400, 'Judul tugas wajib diisi');

  const column = await BoardColumn.findOne({
    where: { id: payload.columnId, boardId: payload.boardId },
  });
  if (!column) throw new HttpError(400, 'Kolom tidak ditemukan di board tersebut');

  await assertPriorityExists(payload.priority);
  if (!(await User.findByPk(payload.createdBy))) {
    throw new HttpError(400, 'Pengguna pembuat tidak ditemukan');
  }

  const task = await Task.create({
    boardId: payload.boardId,
    columnId: column.id,
    title: payload.title.trim(),
    description: payload.description,
    priority: payload.priority, // default 'medium' dari model
    deadline: payload.deadline,
    createdBy: payload.createdBy,
    position: (await Task.max('position', { where: { columnId: column.id } })) + 1,
  });

  if (Array.isArray(payload.assigneeIds) && payload.assigneeIds.length > 0) {
    const users = await User.findAll({ where: { id: payload.assigneeIds }, attributes: ['id'] });
    await TaskAssignee.bulkCreate(users.map((u) => ({ taskId: task.id, userId: u.id })));
  }

  taskManager.notifyObservers({ action: 'created', task, actorUserId: payload.createdBy });
  return getTaskById(task.id);
}

async function updateTask(id, payload, actorUserId) {
  const task = await getTaskById(id);
  if (!task) throw new HttpError(404, 'Tugas tidak ditemukan');

  for (const field of EDITABLE_FIELDS) {
    if (payload[field] !== undefined) task.set(field, payload[field]);
  }
  await assertPriorityExists(task.priority);
  await task.save();

  taskManager.notifyObservers({ action: 'updated', task, actorUserId });
  return task;
}

async function moveTask(id, payload, actorUserId) {
  const task = await Task.findByPk(id);
  if (!task) throw new HttpError(404, 'Tugas tidak ditemukan');

  const targetColumn = await BoardColumn.findOne({
    where: { id: payload.toColumnId, boardId: task.boardId },
  });
  if (!targetColumn) throw new HttpError(400, 'Kolom tujuan tidak ada di board yang sama');

  const fromColumnId = task.columnId;
  task.columnId = targetColumn.id;
  task.position = payload.position !== undefined
    ? payload.position
    : (await Task.max('position', { where: { columnId: targetColumn.id } })) + 1;
  await task.save();

  taskManager.notifyObservers({ action: 'moved', task, fromColumnId, actorUserId });
  return task;
}

async function deleteTask(id, actorUserId) {
  const task = await getTaskById(id);
  if (!task) throw new HttpError(404, 'Tugas tidak ditemukan');

  await task.destroy(); // paranoid: hanya mengisi deleted_at (soft delete)
  taskManager.notifyObservers({ action: 'deleted', task, actorUserId });
  return { deleted: true, id: task.id };
}

module.exports = { getBoardView, getTaskById, createTask, updateTask, moveTask, deleteTask };
