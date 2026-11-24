const SortStrategy = require('./SortStrategy');
const { sortWithinColumns } = require('./sortHelpers');

function getDeadlineTimestamp(task) {
  if (!task.deadline) return null;
  const timestamp = new Date(task.deadline).getTime();
  return Number.isFinite(timestamp) ? timestamp : null;
}

/** Tenggat terdekat tampil lebih dahulu; tugas tanpa deadline tampil terakhir. */
class SortByDeadline extends SortStrategy {
  sort(tasks) {
    return sortWithinColumns(tasks, (left, right) => {
      const leftDate = getDeadlineTimestamp(left);
      const rightDate = getDeadlineTimestamp(right);

      if (leftDate === null && rightDate === null) return 0;
      if (leftDate === null) return 1;
      if (rightDate === null) return -1;
      return leftDate - rightDate;
    });
  }
}

module.exports = SortByDeadline;
