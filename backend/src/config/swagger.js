const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

// Dokumentasi dibaca dari komentar @openapi di file modules/**/*.js.
// Anggota cukup menulis komentar di route modulnya sendiri.
module.exports = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Manager API',
      version: '0.1.0',
      description: 'UAS Pola Desain: Observer + Strategy',
    },
    tags: [
      { name: 'Tasks', description: 'Anggota 1' },
      { name: 'Notifications', description: 'Anggota 2' },
      { name: 'Sorting', description: 'Anggota 3' },
      { name: 'Activity Log', description: 'Anggota 4' },
      { name: 'Reports', description: 'Anggota 5' },
    ],
  },
  apis: [path.join(__dirname, '../modules/**/*.js')],
});
