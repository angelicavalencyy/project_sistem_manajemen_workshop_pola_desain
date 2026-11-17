// Kontrak pendengar event tugas (Observer Pattern).
// Publisher (TaskManager) memanggil update(event) pada setiap listener yang terdaftar.
class TaskEventListener {
  update(event) {
    throw new Error(`${this.constructor.name}.update() belum diimplementasikan`);
  }
}

module.exports = TaskEventListener;