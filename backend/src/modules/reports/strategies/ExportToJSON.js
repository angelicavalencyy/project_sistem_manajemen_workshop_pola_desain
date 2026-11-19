const ExportStrategy = require('./ExportStrategy');

class ExportToJSON extends ExportStrategy {
  getContentType() {
    return 'application/json; charset=utf-8';
  }

  getFileExtension() {
    return 'json';
  }

  async export(tasks) {
    const payload = {
      exportedAt: new Date().toISOString(),
      totalTasks: (tasks || []).length,
      tasks: (tasks || []).map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description ?? null,
        priority: task.priority ?? null,
        column: task.column?.name ?? task.status ?? task.columnId ?? null,
        assignee: task.assignee?.name ?? task.assigneeName ?? task.assignee ?? null,
        deadline: task.deadline ?? null,
      })),
    };

    return JSON.stringify(payload, null, 2);
  }
}

module.exports = ExportToJSON;