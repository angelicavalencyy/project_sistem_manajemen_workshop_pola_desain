// Membuat database jika belum ada (schema dibuat oleh `npm run db:migrate`).
// Jalankan: npm run db:create
const { Client } = require('pg');
const env = require('../src/config/env');

async function main() {
  const client = new Client({
    host: env.db.host,
    port: env.db.port,
    user: env.db.username,
    password: env.db.password,
    database: 'postgres',
  });
  await client.connect();

  const result = await client.query(
    'SELECT 1 FROM pg_database WHERE datname = $1',
    [env.db.database],
  );

  if (result.rows.length === 0) {
    await client.query(`CREATE DATABASE "${env.db.database}"`);
    console.log(`Database "${env.db.database}" berhasil dibuat.`);
  } else {
    console.log(`Database "${env.db.database}" sudah ada.`);
  }

  await client.end();
}

main().catch((err) => {
  console.error('Gagal membuat database:', err.message);
  process.exit(1);
});
