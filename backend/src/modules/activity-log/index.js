const ActivityLogRepository = require('./ActivityLog.repository');
const ActivityLogService = require('./observer/ActivityLogService');
const createRouter = require('./ActivityLog.router');

const repository = new ActivityLogRepository();
const activityLogService = new ActivityLogService({ repository });

// Auto-mounter (modules/index.js) memasang hasil require() langsung sebagai
// Express Router, jadi module ini harus meng-export router, bukan objek biasa.
const router = createRouter({ repository, activityLogService });

// Supaya modul lain (misalnya TaskManager publisher) tetap bisa mengakses
// service-nya, kita tempelkan sebagai properti pada router.
router.activityLogService = activityLogService;

module.exports = router;
