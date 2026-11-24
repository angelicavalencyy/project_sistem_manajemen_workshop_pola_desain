
const { test } = require('node:test');
const assert = require('node:assert/strict');

const SortingService = require('../../src/modules/sorting/SortingService');

// Data tugas untuk pengujian
const tasks = [
    {
        id: 1,
        columnId: 10,
        priority: 'low',
        deadline: '2026-12-10',
        position: 1,
        assignees: [
            {
                id: 1,
                fullName: 'Budi',
                TaskAssignee: { isPrimary: true }
            }
        ],
    },
    {
        id: 2,
        columnId: 10,
        priority: 'high',
        deadline: '2026-12-01',
        position: 2,
        assignees: [
            {
                id: 2,
                fullName: 'Hawa',
                TaskAssignee: { isPrimary: true }
            }
        ],
    },
    {
        id: 3,
        columnId: 10,
        priority: 'medium',
        deadline: null,
        position: 3,
        assignees: [],
    },
    {
        id: 4,
        columnId: 20,
        priority: 'medium',
        deadline: '2026-12-05',
        position: 1,
        assignees: [
            {
                id: 4,
                fullName: 'Andi',
                TaskAssignee: { isPrimary: true }
            }
        ],
    },
    {
        id: 5,
        columnId: 20,
        priority: 'high',
        deadline: '2026-12-02',
        position: 2,
        assignees: [
            {
                id: 5,
                fullName: 'Citra',
                TaskAssignee: { isPrimary: true }
            }
        ],
    },
];

// Mengambil ID tugas untuk mempermudah pemeriksaan hasil
function ids(result) {
    return result.map((task) => task.id);
}

// TEST 1: Pengurutan berdasarkan deadline
test('SortByDeadline: deadline terdekat lebih dahulu di setiap kolom', () => {
    const service = new SortingService();

    assert.deepEqual(
        ids(service.sortTasks(tasks, 'deadline')),
        [2, 1, 3, 5, 4]
    );
});

// TEST 2: Pengurutan berdasarkan priority
test('SortByPriority: high, medium, low di setiap kolom', () => {
    const service = new SortingService();

    assert.deepEqual(
        ids(service.sortTasks(tasks, 'priority')),
        [2, 3, 1, 5, 4]
    );
});

// TEST 3: Pengurutan berdasarkan assignee
test('SortByAssignee: nama assignee A-Z dan tanpa assignee di bawah', () => {
    const service = new SortingService();

    assert.deepEqual(
        ids(service.sortTasks(tasks, 'assignee')),
        [1, 2, 3, 4, 5]
    );
});

// TEST 4: Memastikan data asli tidak berubah
test('Pengurutan tidak mengubah urutan array sumber', () => {
    const service = new SortingService();

    const before = ids(tasks);

    service.sortTasks(tasks, 'priority');

    assert.deepEqual(ids(tasks), before);
});

// TEST 5: Memastikan strategi yang tidak tersedia ditolak
test('Strategi yang tidak tersedia menghasilkan error', () => {
    const service = new SortingService();

    assert.throws(
        () => service.sortTasks(tasks, 'title'),
        /tidak tersedia/
    );
});
