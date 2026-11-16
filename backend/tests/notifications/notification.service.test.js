const { test } = require('node:test');
const assert = require('node:assert/strict');
class FakeRepository {
  constructor() { this.items = []; this.prefs = new Map(); }
  async getEnabledChannels(userId) { return this.prefs.get(userId) ?? ['in_app']; }
  async setEnabledChannels(userId, channels) { this.prefs.set(userId, channels); }
  async save(record) { this.items.push({ ...record }); return record; }
  async findByRecipient(userId) { return this.items.filter((i) => i.recipientUserId === userId); }
}
const NotificationService = require('../../src/modules/notifications/notification.service');

function fakeStrategies() {
  const calls = [];
  const make = (channel) => ({
    send: async (recipient) => {
      calls.push({ channel, recipientId: recipient.id });
      return { channel, delivered: true };
    },
  });
  return {
    calls,
    strategies: { in_app: make('in_app'), email: make('email'), push: make('push') },
  };
}

const event = {
  type: 'TASK_STATUS_CHANGED',
  task: { id: 10, title: 'Revisi Laporan', assigneeIds: [1, 2, 3] },
  actor: { id: 1, name: 'Budi' },
  timestamp: new Date(),
};

test('mengirim notifikasi ke assignee kecuali pelaku aksi', async () => {
  const { calls, strategies } = fakeStrategies();
  const repository = new FakeRepository();
  const service = new NotificationService({ repository, strategies });

  await service.update(event);

  const recipients = calls.map((c) => c.recipientId).sort();
  assert.deepEqual(recipients, [2, 3]);
  assert.equal((await repository.findByRecipient(1)).length, 0);
});

test('memakai channel aktif user, default in-app', async () => {
  const { calls, strategies } = fakeStrategies();
  const repository = new FakeRepository();
  await repository.setEnabledChannels(2, ['email', 'push']);
  const service = new NotificationService({ repository, strategies });

  await service.update(event);

  const user2 = calls.filter((c) => c.recipientId === 2).map((c) => c.channel).sort();
  const user3 = calls.filter((c) => c.recipientId === 3).map((c) => c.channel);
  assert.deepEqual(user2, ['email', 'push']);
  assert.deepEqual(user3, ['in_app']);
});

test('satu channel gagal tidak menghentikan channel lain', async () => {
  const { strategies } = fakeStrategies();
  strategies.email.send = async () => { throw new Error('SMTP mati'); };
  const repository = new FakeRepository();
  await repository.setEnabledChannels(2, ['email', 'in_app']);
  const service = new NotificationService({ repository, strategies });

  const originalError = console.error;
  console.error = () => {};
  try {
    await service.update(event);
  } finally {
    console.error = originalError;
  }

  const saved = await repository.findByRecipient(2);
  assert.deepEqual(saved.map((n) => n.channel), ['in_app']);
});
