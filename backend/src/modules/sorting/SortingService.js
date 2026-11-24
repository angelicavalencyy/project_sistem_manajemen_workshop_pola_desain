const { createSortStrategies } = require('./strategies');

/**
 * Context pada Strategy Pattern.
 * Service memilih algoritma berdasarkan sortBy yang dikirim dari controller.
 */
class SortingService {
  constructor(strategies = createSortStrategies()) {
    this.strategies = strategies;
  }

  sortTasks(tasks, sortBy) {
    const strategy = this.strategies[sortBy];

    if (!strategy) {
      const supported = Object.keys(this.strategies).join(', ');
      throw new RangeError(`Strategi "${sortBy}" tidak tersedia. Pilihan: ${supported}`);
    }

    return strategy.sort(tasks);
  }
}

module.exports = SortingService;
