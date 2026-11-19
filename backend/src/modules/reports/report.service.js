class ReportService {
  constructor({ repository, strategies }) {
    this.repository = repository;
    this.strategies = strategies;
  }

  getSupportedFormats() {
    return Object.keys(this.strategies);
  }

  async generateReport({ format = 'csv', filters = {}, requestedBy = null }) {
    const normalizedFormat = String(format).toLowerCase().trim();
    const strategy = this.strategies[normalizedFormat];

    if (!strategy) {
      const error = new Error(
        `Format ekspor "${format}" tidak didukung. Pilihan yang tersedia: ${this.getSupportedFormats().join(', ')}`
      );
      error.statusCode = 400;
      throw error;
    }

    const tasks = await this.repository.findAllTasks(filters);
    const extension = strategy.getFileExtension();
    const fileName = `laporan-tugas-${Date.now()}.${extension}`;

    try {
      const content = await strategy.export(tasks);

      try {
        await this.repository.createExportHistory({
          format: normalizedFormat,
          status: 'SUCCESS',
          fileName,
          totalRecords: tasks.length,
          requestedBy,
        });
      } catch (historyError) {
        console.warn(
          '[reports] Gagal mencatat ExportHistory:',
          historyError.original?.sqlMessage || historyError.message
        );
      }

      return {
        content,
        contentType: strategy.getContentType(),
        fileName,
        totalRecords: tasks.length,
      };
    } catch (err) {
      await this.repository
        .createExportHistory({
          format: normalizedFormat,
          status: 'FAILED',
          fileName,
          totalRecords: tasks.length,
          requestedBy,
          errorMessage: err.message,
        })
        .catch(() => {});

      throw err;
    }
  }

  async getExportHistory(limit = 20) {
    return this.repository.findAllHistory(limit);
  }
}

module.exports = ReportService;