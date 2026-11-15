const { Router } = require('express');
const service = require('./task-service');
const HttpError = require('./errors');

const router = Router();

// Bungkus handler async agar error otomatis diteruskan ke error handler di bawah.
const wrap = (handler) => (req, res, next) => Promise.resolve(handler(req, res)).catch(next);

/**
 * @openapi
 * /api/tasks/board/{boardId}:
 *   get:
 *     tags: [Tasks]
 *     summary: Data papan Kanban (kolom + kartu per kolom)
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Board tidak ditemukan }
 */
router.get('/board/:boardId', wrap(async (req, res) => {
  const columns = await service.getBoardView(req.params.boardId);
  if (!columns) throw new HttpError(404, 'Board tidak ditemukan');
  res.json({ boardId: Number(req.params.boardId), columns });
}));

/**
 * @openapi
 * /api/tasks:
 *   post:
 *     tags: [Tasks]
 *     summary: Buat kartu tugas baru
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [boardId, columnId, title, createdBy]
 *             properties:
 *               boardId: { type: integer }
 *               columnId: { type: integer }
 *               title: { type: string }
 *               description: { type: string }
 *               priority: { type: string, example: high }
 *               deadline: { type: string, format: date-time }
 *               createdBy: { type: integer }
 *               assigneeIds: { type: array, items: { type: integer } }
 *     responses:
 *       201: { description: Dibuat }
 *       400: { description: Payload tidak valid }
 */
router.post('/', wrap(async (req, res) => {
  res.status(201).json(await service.createTask(req.body));
}));

/**
 * @openapi
 * /api/tasks/{id}:
 *   put:
 *     tags: [Tasks]
 *     summary: Edit kartu tugas (judul, deskripsi, prioritas, deadline)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Tugas tidak ditemukan }
 */
router.put('/:id', wrap(async (req, res) => {
  res.json(await service.updateTask(req.params.id, req.body, req.body.actorUserId));
}));

/**
 * @openapi
 * /api/tasks/{id}/move:
 *   patch:
 *     tags: [Tasks]
 *     summary: Pindah kartu ke kolom lain (perubahan status, mis. To Do -> In Progress)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [toColumnId]
 *             properties:
 *               toColumnId: { type: integer }
 *               position: { type: integer, description: opsional, default di akhir kolom }
 *     responses:
 *       200: { description: OK }
 *       400: { description: Kolom tujuan tidak valid }
 *       404: { description: Tugas tidak ditemukan }
 */
router.patch('/:id/move', wrap(async (req, res) => {
  res.json(await service.moveTask(req.params.id, req.body, req.body.actorUserId));
}));

/**
 * @openapi
 * /api/tasks/{id}:
 *   delete:
 *     tags: [Tasks]
 *     summary: Hapus kartu tugas (soft delete)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Dihapus }
 *       404: { description: Tugas tidak ditemukan }
 */
router.delete('/:id', wrap(async (req, res) => {
  res.json(await service.deleteTask(req.params.id, req.body.actorUserId));
}));

// eslint-disable-next-line no-unused-vars
router.use((err, req, res, next) => {
  const status = err instanceof HttpError
    ? err.status
    : err.name === 'SequelizeValidationError' ? 400 : 500;
  res.status(status).json({ error: err.message });
});

module.exports = router;
