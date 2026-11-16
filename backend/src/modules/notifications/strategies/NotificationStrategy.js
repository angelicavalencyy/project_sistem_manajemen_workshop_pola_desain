// Strategy interface: setiap channel pengiriman notifikasi wajib mengimplementasi send().
class NotificationStrategy {
  /**
   * @param {{ id: number, email?: string }} recipient
   * @param {{ title: string, message: string }} notification
   * @returns {Promise<{ channel: string, delivered: boolean }>}
   */
  async send(recipient, notification) {
    throw new Error(`${this.constructor.name} belum mengimplementasi send()`);
  }
}

module.exports = NotificationStrategy;
