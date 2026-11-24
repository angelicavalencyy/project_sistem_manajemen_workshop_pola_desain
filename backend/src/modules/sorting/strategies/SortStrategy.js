class SortStrategy {
  /**
   * @param {Array<object>} tasks
   * @returns {Array<object>}
   */
  sort(tasks) {
    throw new Error(`${this.constructor.name} harus mengimplementasikan method sort()`);
  }
}

module.exports = SortStrategy;
