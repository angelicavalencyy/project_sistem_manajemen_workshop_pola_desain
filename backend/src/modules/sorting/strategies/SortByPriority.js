const SortStrategy = require('./SortStrategy');
const { sortWithinColumns } = require('./sortHelpers');

const PRIORITY_ORDER = Object.freeze({
  high: 1,
  medium: 2,
  low: 3,
});

function getPriorityOrder(task) {
  return PRIORITY_ORDER[String(task.priority ?? '').toLowerCase()] ?? Number.MAX_SAFE_INTEGER;
}

/** Prioritas High tampil lebih dahulu, kemudian Medium, lalu Low. */
class SortByPriority extends SortStrategy {
  sort(tasks) {
    return sortWithinColumns(tasks, (left, right) =>
      getPriorityOrder(left) - getPriorityOrder(right),
    );
  }
}

module.exports = SortByPriority;
