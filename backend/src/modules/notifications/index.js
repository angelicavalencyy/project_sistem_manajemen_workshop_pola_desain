const { Router } = require('express');
const NotificationRepository = require('./notification.repository');
const NotificationService = require('./notification.service');
const { createStrategies } = require('./strategies');

const repository = new NotificationRepository();
const notificationService = new NotificationService({
  repository,
  strategies: createStrategies(),
});

const router = Router();

/**
 * @openapi
 * /api/notifications:
 *   get:
 *     tags: [Notifications]
 *     summary: Daftar notifikasi milik satu user
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Daftar notifikasi
 *       400:
 *         description: userId tidak valid
 */
router.get('/', async (req, res) => {
  const userId = Number(req.query.userId);
  if (!Number.isInteger(userId)) {
    return res.status(400).json({ error: 'userId wajib berupa angka' });
  }
  res.json(await repository.findByRecipient(userId));
});

/**
 * @openapi
 * /api/notifications/{id}/read:
 *   patch:
 *     tags: [Notifications]
 *     summary: Tandai notifikasi sudah dibaca
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Notifikasi yang sudah diperbarui
 *       404:
 *         description: Notifikasi tidak ditemukan
 */
router.patch('/:id/read', async (req, res) => {
  const record = await repository.markRead(Number(req.params.id));
  if (!record) return res.status(404).json({ error: 'Notifikasi tidak ditemukan' });
  res.json(record);
});

module.exports = router;
