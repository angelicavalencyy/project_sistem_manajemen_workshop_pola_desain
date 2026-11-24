const { Router } = require('express');
const SortingRepository = require('./Sorting.repository');
const SortingService = require('./SortingService');
const createSortingController = require('./Sorting.controller');

const router = Router();
const repository = new SortingRepository();
const sortingService = new SortingService();
const controller = createSortingController({ repository, sortingService });

/**
 * @openapi
 * /api/sorting/options:
 *   get:
 *     tags: [Sorting]
 *     summary: Daftar pilihan pengurutan untuk dropdown Sort By
 *     responses:
 *       200:
 *         description: Daftar strategi pengurutan yang tersedia
 */
router.get('/options', controller.getOptions);

/**
 * @openapi
 * /api/sorting:
 *   get:
 *     tags: [Sorting]
 *     summary: Mengambil tugas pada board dan mengurutkan kartu dengan Strategy Pattern
 *     description: |
 *       Pengurutan dilakukan di dalam setiap kolom Kanban. Status/kolom tugas tidak
 *       diubah dan hasil pengurutan tidak disimpan ke database.
 *     parameters:
 *       - in: query
 *         name: boardId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: sortBy
 *         required: false
 *         description: deadline (default), priority, atau assignee
 *         schema:
 *           type: string
 *           enum: [deadline, priority, assignee]
 *           default: deadline
 *       - in: query
 *         name: columnId
 *         required: false
 *         description: Opsional untuk mengurutkan hanya satu kolom Kanban
 *         schema:
 *           type: integer
 *         example: 2
 *     responses:
 *       200:
 *         description: Daftar tugas yang sudah diurutkan
 *       400:
 *         description: Parameter query tidak valid
 *       500:
 *         description: Kesalahan saat membaca database
 */
router.get('/', controller.sortTasks);

module.exports = router;
