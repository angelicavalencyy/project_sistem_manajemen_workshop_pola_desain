// Config untuk sequelize-cli (db:migrate). Membaca variabel yang sama dengan aplikasi.
const env = require('./env');

const config = { ...env.db };

module.exports = {
  development: config,
  test: config,
  production: config,
};
