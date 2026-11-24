const { Task, BoardColumn, User } = require('../../models');

class SortingRepository {
  /**
   * Mengambil tugas berdasarkan board, beserta kolom dan assignee.
   * Sequelize paranoid pada model Task otomatis mengecualikan soft-deleted task.
   *
   * @param {{ boardId: number, columnId?: number }} filters
   * @returns {Promise<Array<object>>}
   */
  async findTasks({ boardId, columnId }) {
    const where = { boardId };
    if (columnId !== undefined) where.columnId = columnId;

    const tasks = await Task.findAll({
      where,
      attributes: [
        'id',
        'boardId',
        'columnId',
        'title',
        'description',
        'priority',
        'deadline',
        'position',
        'createdBy',
        'createdAt',
        'updatedAt',
      ],
      include: [
        {
          model: BoardColumn,
          as: 'column',
          attributes: ['id', 'name', 'position'],
          required: false,
        },
        {
          model: User,
          as: 'assignees',
          attributes: ['id', 'fullName', 'avatarUrl'],
          through: { attributes: ['isPrimary'] },
          required: false,
        },
      ],
      // Urutan awal yang konsisten untuk tugas dengan nilai pengurutan sama.
      order: [['columnId', 'ASC'], ['position', 'ASC'], ['id', 'ASC']],
    });

    return tasks.map((task) => task.toJSON());
  }
}

module.exports = SortingRepository;
