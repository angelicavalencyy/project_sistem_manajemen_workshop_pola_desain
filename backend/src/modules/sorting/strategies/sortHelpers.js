function sortWithinColumns(tasks, comparator) {
  if (!Array.isArray(tasks)) {
    throw new TypeError('Data tugas harus berupa array');
  }

  const groups = new Map();

  tasks.forEach((task, originalIndex) => {
    const columnKey = task.columnId ?? task.column?.id ?? '__without_column__';

    if (!groups.has(columnKey)) groups.set(columnKey, []);
    groups.get(columnKey).push({ task, originalIndex });
  });

  return Array.from(groups.values()).flatMap((group) =>
    group
      .sort((left, right) => {
        const compared = comparator(left.task, right.task);
        // Tie-breaker ini mempertahankan urutan awal jika nilai sort sama.
        return compared || left.originalIndex - right.originalIndex;
      })
      .map(({ task }) => task),
  );
}

function compareNullableText(left, right) {
  const a = String(left ?? '').trim();
  const b = String(right ?? '').trim();

  // Data kosong selalu berada di bagian bawah.
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;

  return a.localeCompare(b, 'id', { sensitivity: 'base' });
}

module.exports = { sortWithinColumns, compareNullableText };
