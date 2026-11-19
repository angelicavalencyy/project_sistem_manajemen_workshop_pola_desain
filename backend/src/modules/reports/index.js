const { Router } = require('express');
const ReportRepository = require('./report.repository');
const ReportService = require('./report.service');
const { EXPORT_STRATEGIES } = require('./strategies');

const repository = new ReportRepository();
const reportService = new ReportService({
  repository,
  strategies: EXPORT_STRATEGIES,
});

const router = Router();

router.get('/export', async (req, res, next) => {
  try {
    const { format = 'csv', priority, columnId, requestedBy } = req.query;

    const report = await reportService.generateReport({
      format,
      filters: { priority, columnId },
      requestedBy,
    });

    res.setHeader('Content-Type', report.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${report.fileName}"`);

    return res.send(report.content);
  } catch (error) {
    if (error.statusCode === 400) {
      return res.status(400).json({ message: error.message });
    }
    return next(error);
  }
});

router.get('/history', async (req, res, next) => {
  try {
    const history = await reportService.getExportHistory();
    return res.json({ data: history });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;