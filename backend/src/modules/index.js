// Auto-mount: setiap folder di modules/ yang punya index.js dan meng-export Express router
// otomatis dipasang di /api/<nama-folder>. Tidak perlu mengubah file ini saat menambah fitur.
//
// Contoh modules/tasks/index.js:
//   const { Router } = require('express');
//   const router = Router();
//   router.get('/', (req, res) => res.json([]));
//   module.exports = router;     // -> GET /api/tasks
const fs = require('fs');
const path = require('path');
const { Router } = require('express');

const router = Router();

for (const entry of fs.readdirSync(__dirname, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const indexFile = path.join(__dirname, entry.name, 'index.js');
  if (!fs.existsSync(indexFile)) continue;
  router.use(`/${entry.name}`, require(indexFile));
}

module.exports = router;
