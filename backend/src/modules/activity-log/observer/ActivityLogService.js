// Observer kedua: menerima event dari TaskManager (Publisher) lewat update(event).
//
// Bentuk event yang didukung:
//   { type, task: { id, title, boardId, columnId }, actor: { id, name }, timestamp,
//     changes?: { from, to }                       // nama tab langsung, ATAU
//     changes?: { fromColumnId, toColumnId } }     // id kolom, nama dicari lewat BoardColumn
const EventEmitter = require('events');

const MAX_DESCRIPTION = 255; // sesuai kolom description STRING(255)

const ACTIONS = Object.freeze({
  TASK_CREATED: 'CREATED',
  TASK_UPDATED: 'UPDATED',
  TASK_DELETED: 'DELETED',
  TASK_STATUS_CHANGED: 'STATUS_CHANGED',
});

// Merangkai kalimat jejak audit: "Siapa melakukan apa".
const SENTENCES = Object.freeze({
  TASK_CREATED: (who, title) => `${who} membuat tugas "${title}"`,
  TASK_UPDATED: (who, title) => `${who} memperbarui tugas "${title}"`,
  TASK_DELETED: (who, title) => `${who} menghapus tugas "${title}"`,
  TASK_STATUS_CHANGED: (who, title, column) =>
    column
      ? `${who} memindahkan tugas "${title}" ke tab ${column.to.name}`
      : `${who} mengubah status tugas "${title}"`,
});

const truncate = (text, max) => (text.length > max ? `${text.slice(0, max - 1)}…` : text);

class ActivityLogService {
  constructor({ repository }) {
    this.repository = repository;
    this.stream = new EventEmitter(); // jembatan ke SSE (real-time)
  }

  /** Dipanggil Publisher. Sengaja tidak melempar error agar alur CRUD tidak terganggu. */
  update(event) {
    return this.#record(event);
  }

  /** Tentukan kolom asal dan tujuan: { from: {id, name}, to: {id, name} } atau null. */
  async #resolveColumns(event) {
    const c = event.changes ?? {};
    const toId = c.toColumnId ?? (c.to === undefined ? event.task.columnId : undefined);
    const fromId = c.fromColumnId;

    const [toName, fromName] = await Promise.all([
      c.to ?? this.repository.findColumnName(toId),
      c.from ?? this.repository.findColumnName(fromId),
    ]);
    if (!toName) return null;
    return {
      to: { id: toId ?? null, name: toName },
      from: { id: fromId ?? null, name: fromName ?? null },
    };
  }

  async #record(event) {
    const action = ACTIONS[event.type];
    if (!action) return;

    // Kolom actorUserId wajib diisi (allowNull: false), jadi tanpa pelaku log dilewati.
    const actorUserId = event.actor?.id;
    if (actorUserId == null) {
      console.warn(`[activity] ${event.type} task #${event.task?.id} dilewati: actor.id tidak ada`);
      return;
    }

    try {
      const who = event.actor.name ?? 'Seseorang';
      const column = event.type === 'TASK_STATUS_CHANGED' ? await this.#resolveColumns(event) : null;

      const entry = {
        actorUserId,
        taskId: event.task.id,
        boardId: event.task.boardId ?? null,
        action,
        description: truncate(SENTENCES[event.type](who, event.task.title, column), MAX_DESCRIPTION),
        // Jejak perubahan tab: dari mana ke mana.
        oldValue: column?.from.name ? { columnId: column.from.id, column: column.from.name } : null,
        newValue: column ? { columnId: column.to.id, column: column.to.name } : null,
      };

      const saved = await this.repository.save(entry);
      this.stream.emit('activity', saved); // dorong ke semua sidebar yang terbuka
      console.log(`[activity] ${saved.description}`);
    } catch (err) {
      // Gagal mencatat log tidak boleh menggagalkan operasi tugas atau observer lain.
      console.error(`[activity] gagal mencatat ${event.type} task #${event.task?.id}`, err);
    }
  }
}

module.exports = ActivityLogService;