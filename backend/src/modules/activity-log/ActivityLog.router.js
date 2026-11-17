const { Router } = require('express');

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
const HEARTBEAT_MS = 25000;

// Ubah query string menjadi integer. undefined = tidak diisi, NaN = tidak valid.
const parseInteger = (value) => {
  if (value === undefined) return undefined;
  return /^\d+$/.test(String(value)) ? Number(value) : NaN;
};

/**
 * Router riwayat aktivitas (audit trail).
 * Dependensi disuntik dari index.js supaya tidak membuat instance sendiri.
 */
function createRouter({ repository, activityLogService }) {
  const router = Router();

  /**
   * @openapi
   * /api/activity-log:
   *   get:
   *     tags: [Activity Log]
   *     summary: Riwayat aktivitas (audit trail), terbaru dulu
   *     description: |
   *       Menampilkan daftar riwayat aktivitas (audit trail) dengan urutan terbaru.
   *       Semua parameter bersifat opsional. Jika tidak diisi, akan menampilkan semua data.
   *     parameters:
   *       - in: query
   *         name: taskId
   *         description: Filter berdasarkan ID tugas tertentu
   *         schema:
   *           type: integer
   *           example: 1
   *       - in: query
   *         name: actorUserId
   *         description: Filter berdasarkan ID user yang melakukan aksi
   *         schema:
   *           type: integer
   *           example: 1
   *       - in: query
   *         name: limit
   *         description: Jumlah data per halaman (maks 100)
   *         schema:
   *           type: integer
   *           default: 20
   *           maximum: 100
   *           example: 20
   *       - in: query
   *         name: offset
   *         description: Mulai dari data ke-berapa (untuk pagination)
   *         schema:
   *           type: integer
   *           default: 0
   *           example: 0
   *     responses:
   *       200:
   *         description: Daftar riwayat aktivitas
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 total:
   *                   type: integer
   *                   example: 2
   *                 items:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: integer
   *                         example: 1
   *                       actorUserId:
   *                         type: integer
   *                         example: 1
   *                       taskId:
   *                         type: integer
   *                         example: 1
   *                       boardId:
   *                         type: integer
   *                         example: 1
   *                       action:
   *                         type: string
   *                         example: CREATED
   *                         enum: [CREATED, UPDATED, DELETED, STATUS_CHANGED]
   *                       description:
   *                         type: string
   *                         example: 'Angelica membuat tugas "Desain UI Login"'
   *                       oldValue:
   *                         type: object
   *                         nullable: true
   *                         example: null
   *                       newValue:
   *                         type: object
   *                         nullable: true
   *                         example: { columnId: 2, column: "In Progress" }
   *                       createdAt:
   *                         type: string
   *                         format: date-time
   *                         example: "2026-11-17T05:30:00.000Z"
   *       400:
   *         description: Parameter tidak valid
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Parameter harus berupa angka bulat yang valid"
   */
  router.get('/', async (req, res, next) => {
    try {
      const taskId = parseInteger(req.query.taskId);
      const actorUserId = parseInteger(req.query.actorUserId);
      const limit = parseInteger(req.query.limit) ?? DEFAULT_LIMIT;
      const offset = parseInteger(req.query.offset) ?? 0;

      const invalid = [taskId, actorUserId, limit, offset].some(Number.isNaN);
      if (invalid || limit < 1) {
        return res.status(400).json({ error: 'Parameter harus berupa angka bulat yang valid' });
      }

      const result = await repository.findAll({
        taskId,
        actorUserId,
        limit: Math.min(limit, MAX_LIMIT),
        offset,
      });
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  /**
   * @openapi
   * /api/activity-log/stream:
   *   get:
   *     tags: [Activity Log]
   *     summary: Stream aktivitas real-time (Server-Sent Events)
   *     description: |
   *       Endpoint SSE (Server-Sent Events) untuk menerima aktivitas secara real-time.
   *       Koneksi tetap terbuka dan setiap ada aktivitas baru, server akan mengirim event.
   *       Gunakan EventSource di browser untuk menghubungkan:
   *       ```js
   *       const es = new EventSource('/api/activity-log/stream');
   *       es.onmessage = (e) => console.log(JSON.parse(e.data));
   *       ```
   *       **Catatan:** Tidak cocok di-test via Swagger karena koneksi tidak pernah ditutup.
   *     responses:
   *       200:
   *         description: Stream event (text/event-stream)
   *         content:
   *           text/event-stream:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                   example: 5
   *                 actorUserId:
   *                   type: integer
   *                   example: 1
   *                 taskId:
   *                   type: integer
   *                   example: 3
   *                 action:
   *                   type: string
   *                   example: STATUS_CHANGED
   *                 description:
   *                   type: string
   *                   example: 'Angelica memindahkan tugas "Desain UI" ke tab Done'
   *                 oldValue:
   *                   type: object
   *                   example: { columnId: 1, column: "To Do" }
   *                 newValue:
   *                   type: object
   *                   example: { columnId: 3, column: "Done" }
   *                 createdAt:
   *                   type: string
   *                   format: date-time
   *                   example: "2026-11-17T05:45:00.000Z"
   */
  router.get('/stream', (req, res) => {
    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no', // matikan buffering di nginx
    });
    res.flushHeaders();
    res.write('retry: 3000\n\n'); // klien menyambung ulang setelah 3 detik jika putus

    const send = (entry) => res.write(`data: ${JSON.stringify(entry)}\n\n`);
    const heartbeat = setInterval(() => res.write(': ping\n\n'), HEARTBEAT_MS);

    activityLogService.stream.on('activity', send);

    // Bersihkan listener saat klien menutup koneksi agar tidak terjadi memory leak.
    req.on('close', () => {
      clearInterval(heartbeat);
      activityLogService.stream.off('activity', send);
    });
  });

  return router;
}

module.exports = createRouter;  