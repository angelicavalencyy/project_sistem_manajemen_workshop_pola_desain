const ExportToCSV = require('./ExportToCSV');
const ExportToJSON = require('./ExportToJSON');
const ExportToPDF = require('./ExportToPDF');

const EXPORT_STRATEGIES = Object.freeze({
  csv: new ExportToCSV(),
  json: new ExportToJSON(),
  pdf: new ExportToPDF(),
});

module.exports = { EXPORT_STRATEGIES };