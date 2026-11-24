const SortStrategy = require('./SortStrategy');
const { sortWithinColumns, compareNullableText } = require('./sortHelpers');

/**
 * Mengambil nama penanggung jawab utama (isPrimary).
 * Jika belum ada penanggung jawab utama, gunakan nama assignee pertama
 * setelah daftar assignee diurutkan secara alfabetis.
 */
function getPrimaryAssigneeName(task) {
  const assignees = Array.isArray(task.assignees) ? [...task.assignees] : [];
  if (assignees.length === 0) return '';

  const primary = assignees.find((user) =>
    user.TaskAssignee?.isPrimary === true ||
    user.taskAssignee?.isPrimary === true ||
    user.isPrimary === true,
  );

  if (primary) return primary.fullName ?? primary.name ?? '';

  assignees.sort((left, right) =>
    compareNullableText(left.fullName ?? left.name, right.fullName ?? right.name),
  );

  return assignees[0]?.fullName ?? assignees[0]?.name ?? '';
}

/** Nama assignee diurutkan alfabetis A-Z; tugas tanpa assignee di bagian bawah. */
class SortByAssignee extends SortStrategy {
  sort(tasks) {
    return sortWithinColumns(tasks, (left, right) =>
      compareNullableText(getPrimaryAssigneeName(left), getPrimaryAssigneeName(right)),
    );
  }
}

module.exports = SortByAssignee;
