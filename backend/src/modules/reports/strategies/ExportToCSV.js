const ExportStrategy = require('./ExportStrategy');

class ExportToCSV extends ExportStrategy {
  getContentType() {
    return 'text/csv; charset=utf-8';
  }

  getFileExtension() {
    return 'csv';
  }

  escapeCell(value) {
    let text = String(value ?? '');

    if (/^[\t\r\n ]*[=+\-@]/.test(text)) {
      text = `'${text}`;
    }

    return `"${text.replace(/"/g, '""')}"`;
  }

  formatDate(value) {
    if (!value) return '-';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? String(value) : date.toISOString().split('T')[0];
  }

  async export(tasks) {
    const headers = ['ID', 'Judul Tugas', 'Deskripsi', 'Prioritas', 'Status / Kolom', 'Assignee', 'Deadline'];

    const rows = (tasks || []).map((task) => [
      task.id,
      task.title,
      task.description ?? '-',
      task.priority ?? '-',
      task.column?.name ?? task.status ?? task.columnId ?? '-',
      task.assignee?.name ?? task.assigneeName ?? task.assignee ?? '-',
      this.formatDate(task.deadline),
    ]);

    return [
      headers.map((h) => this.escapeCell(h)).join(','),
      ...rows.map((row) => row.map((cell) => this.escapeCell(cell)).join(',')),
    ].join('\r\n');
  }
}

module.exports = ExportToCSV;