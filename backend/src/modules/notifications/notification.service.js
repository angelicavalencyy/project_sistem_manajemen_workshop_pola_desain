// Observer: menerima event dari TaskManager (Subject) lewat update(event).
// Event: { type, task: { id, title, assigneeIds }, actor: { id, name }, timestamp }
// Strategy context: memilih strategi pengiriman sesuai channel aktif user.
const TITLES = Object.freeze({
  TASK_CREATED: 'Tugas baru',
  TASK_UPDATED: 'Tugas diperbarui',
  TASK_DELETED: 'Tugas dihapus',
  TASK_STATUS_CHANGED: 'Status tugas berubah',
});

class NotificationService {
  constructor({ repository, strategies }) {
    this.repository = repository;
    this.strategies = strategies;
  }

  update(event) {
    return this.#notifyRecipients(event);
  }

  async #notifyRecipients(event) {
    const title = TITLES[event.type];
    if (!title) return;

    const actorId = event.actor?.id;
    const recipients = (event.task.assigneeIds ?? []).filter((id) => id !== actorId);
    console.log(`[notifications] ${event.type} task #${event.task.id} oleh ${event.actor?.name ?? actorId} -> ${recipients.length} penerima`);
    const notification = {
      title,
      message: `${event.actor?.name ?? 'Seseorang'} memperbarui tugas "${event.task.title}"`,
    };

    await Promise.all(recipients.map((userId) => this.#notifyUser(userId, event.task.id, notification)));
  }

  async #notifyUser(userId, taskId, notification) {
    const channels = await this.repository.getEnabledChannels(userId);
    for (const channel of channels) {
      const strategy = this.strategies[channel];
      if (!strategy) {
        console.warn(`[notifications] channel "${channel}" belum terdaftar`);
        continue;
      }
      try {
        await strategy.send({ id: userId }, notification);
        await this.repository.save({ recipientUserId: userId, taskId, channel, ...notification });
        console.log(`[notifications] terkirim channel=${channel} user=${userId} task=#${taskId}`);
      } catch (err) {
        // Satu channel gagal tidak boleh menghentikan channel lain.
        console.error(`[notifications] gagal kirim lewat ${channel} ke user ${userId}`, err);
      }
    }
  }
}

module.exports = NotificationService;
