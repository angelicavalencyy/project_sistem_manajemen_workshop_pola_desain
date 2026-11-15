// Error HTTP sederhana agar service bisa menandai status code,
// ditangkap error handler di index.js.
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

module.exports = HttpError;
