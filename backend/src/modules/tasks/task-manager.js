// Subject / Publisher dalam Observer Pattern.
// Anggota lain (notifications, activity-log) mendaftar observer-nya lewat
// subscribe() dan akan dipanggil setiap kali tugas dibuat, diedit, dihapus,
// atau dipindah status.
class TaskManager {
  constructor() {
    this.observers = [];
  }

  subscribe(observer) {
    if (!this.observers.includes(observer)) this.observers.push(observer);
    return this;
  }

  unsubscribe(observer) {
    this.observers = this.observers.filter((o) => o !== observer);
    return this;
  }

  // payload: { action: 'created' | 'updated' | 'moved' | 'deleted', task, actorUserId, ... }
  notifyObservers(taskData) {
    for (const observer of this.observers) {
      try {
        observer.update(taskData);
      } catch (err) {
        // Satu observer yang gagal tidak boleh menggagalkan request utama.
        console.error('Observer gagal memproses notifikasi:', err.message);
      }
    }
  }
}

// Satu instance dibagikan ke seluruh aplikasi.
module.exports = new TaskManager();
