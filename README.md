# Sistem Manajemen Tugas (Task Manager)

Proyek UAS Pola Desain. Backend Express.js yang menerapkan **Observer Pattern** dan **Strategy Pattern**.

## Pembagian modul

| Modul | Anggota | Pola | Isi |
|---|---|---|---|
| `tasks` | 1 | Observer (Subject/Publisher) | CRUD kartu tugas, pindah status, `TaskManager.notifyObservers()` |
| `notifications` | 2 | Observer + Strategy | `NotificationService`, `EmailStrategy`, `InAppStrategy`, `PushNotificationStrategy` |
| `sorting` | 3 | Strategy | `SortStrategy`, `SortByDeadline`, `SortByPriority`, `SortByAssignee` |
| `activity-log` | 4 | Observer | `ActivityLogService`, mencatat riwayat aktivitas |
| `reports` | 5 | Strategy | `ExportStrategy`, `ExportToCSV`, `ExportToPDF`, `ExportToJSON` |

## Struktur folder

```
.
├── README.md
├── frontend/                  placeholder
└── backend/
    ├── package.json
    ├── .env.example           contoh konfigurasi (salin menjadi .env)
    ├── src/
    │   ├── server.js          menjalankan server
    │   ├── app.js             middleware, /health, /api-docs, /api
    │   ├── config/
    │   │   ├── env.js         membaca .env
    │   │   └── swagger.js     pengaturan Swagger
    │   ├── shared/            kode yang dipakai lebih dari satu modul
    │   └── modules/
    │       ├── index.js       memasang semua modul otomatis (jangan diubah)
    │       ├── tasks/
    │       ├── notifications/
    │       ├── sorting/
    │       ├── activity-log/
    │       └── reports/
    └── tests/
```

| Folder | Fungsi |
|---|---|
| `modules/<nama>/` | Tempat kerja satu anggota. Isi dan sub-foldernya bebas diatur, misalnya `strategies/`. |
| `shared/` | Kode bersama, misalnya base class `Observer` dan `Subject`, atau konstanta event. Perubahan dibicarakan dulu agar tidak bentrok. |
| `config/` | Konfigurasi aplikasi. Anggota biasanya tidak perlu mengubahnya. |
| `tests/` | Pengujian. Boleh dibuat sub-folder per modul. |

## Menjalankan backend

Syarat: Node.js 18 atau lebih baru.

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

| Script | Fungsi |
|---|---|
| `npm run dev` | Jalankan dengan auto-reload saat file berubah |
| `npm start` | Jalankan biasa |
| `npm test` | Jalankan test di `tests/` |

Setelah berjalan (port default 3000, ubah lewat `PORT` di `.env`):

| URL | Fungsi |
|---|---|
| `http://localhost:3000/health` | Cek server hidup |
| `http://localhost:3000/api-docs` | Dokumentasi Swagger |
| `http://localhost:3000/api/<nama-modul>` | Endpoint tiap modul |

## Cara menambah fitur di modul

Folder `modules/<nama>/` yang punya `index.js` dan meng-export Express router akan otomatis aktif di `/api/<nama>`. Anggota tidak perlu mengubah `app.js`, `server.js`, atau `modules/index.js`.

Contoh `modules/tasks/index.js`:

```js
const { Router } = require('express');

const router = Router();

/**
 * @openapi
 * /api/tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: Daftar tugas
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', (req, res) => res.json([]));

module.exports = router;
```

Endpoint di atas aktif di `GET /api/tasks`.

## Swagger

Dokumentasi dibaca dari komentar `@openapi` di file `.js` mana pun di dalam `modules/`. Tulis komentar seperti contoh di atas tepat di atas route, lalu muat ulang `/api-docs`. Tag yang tersedia: `Tasks`, `Notifications`, `Sorting`, `Activity Log`, `Reports`. Tag baru ditambah di `config/swagger.js`.

## Alur kerja Git

- `main` hanya berisi kerangka dan hasil yang sudah digabung.
- Satu branch per fitur, dengan nama `feature/<nama-modul>`, misalnya `feature/notifications`.
- Kerjakan hanya di folder modul sendiri. Itu yang membuat merge tidak bentrok.
- Kalau perlu mengubah `shared/`, `config/`, atau `package.json`, kabari anggota lain dulu.
- File `.env` tidak ikut git. Jangan commit.

```bash
git checkout main
git pull
git checkout -b feature/notifications
# ... kerjakan, lalu
git add backend/src/modules/notifications
git commit -m "feat(notifications): tambah EmailStrategy"
git push -u origin feature/notifications
```
