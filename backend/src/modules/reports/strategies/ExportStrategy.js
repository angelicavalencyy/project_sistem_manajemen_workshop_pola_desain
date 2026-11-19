class ExportStrategy {
  getContentType() {
    throw new Error(`${this.constructor.name} belum mengimplementasikan getContentType()`);
  }

  getFileExtension() {
    throw new Error(`${this.constructor.name} belum mengimplementasikan getFileExtension()`);
  }

  async export(tasks) {
    throw new Error(`${this.constructor.name} belum mengimplementasikan export()`);
  }
}

module.exports = ExportStrategy;