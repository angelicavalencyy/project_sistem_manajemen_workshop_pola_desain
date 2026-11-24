const { SORT_OPTIONS } = require('./strategies');

const ALLOWED_SORTS = new Set(SORT_OPTIONS.map((option) => option.value));

function parsePositiveInteger(value) {
  if (value === undefined || value === null || !/^\d+$/.test(String(value))) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
}

function createSortingController({ repository, sortingService }) {
  async function getOptions(req, res) {
    return res.json({ items: SORT_OPTIONS });
  }

  async function sortTasks(req, res) {
    const boardId = parsePositiveInteger(req.query.boardId);
    const hasColumnId = req.query.columnId !== undefined;
    const columnId = hasColumnId ? parsePositiveInteger(req.query.columnId) : undefined;
    const sortBy = req.query.sortBy ?? 'deadline';

    if (!boardId) {
      return res.status(400).json({
        error: 'Parameter boardId wajib diisi dengan angka bulat positif.',
      });
    }

    if (hasColumnId && !columnId) {
      return res.status(400).json({
        error: 'Parameter columnId harus berupa angka bulat positif.',
      });
    }

    if (typeof sortBy !== 'string' || !ALLOWED_SORTS.has(sortBy)) {
      return res.status(400).json({
        error: 'sortBy tidak valid.',
        allowedSorts: SORT_OPTIONS.map((option) => option.value),
      });
    }

    try {
      const tasks = await repository.findTasks({ boardId, columnId });
      const sortedTasks = sortingService.sortTasks(tasks, sortBy);

      return res.json({
        boardId,
        ...(columnId !== undefined ? { columnId } : {}),
        sortBy,
        sortLabel: SORT_OPTIONS.find((option) => option.value === sortBy).label,
        total: sortedTasks.length,
        items: sortedTasks,
      });
    } catch (error) {
      console.error('[sorting] Gagal mengambil atau mengurutkan tugas:', error);
      return res.status(500).json({
        error: 'Terjadi kesalahan saat mengambil dan mengurutkan tugas.',
      });
    }
  }

  return { getOptions, sortTasks };
}

module.exports = createSortingController;
