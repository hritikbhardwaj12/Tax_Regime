const db = require('../database');
const crypto = require('crypto');

class PasswordReset {
  static createToken(userId) {
    return new Promise((resolve, reject) => {
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now
      
      db.run(
        `INSERT INTO password_resets (user_id, token, expires_at) 
         VALUES (?, ?, ?)`,
        [userId, token, expiresAt.toISOString()],
        function(err) {
          if (err) return reject(err);
          resolve(token);
        }
      );
    });
  }

  static findByToken(token) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM password_resets 
         WHERE token = ? AND used = 0 AND expires_at > datetime('now')`,
        [token],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });
  }

  static markAsUsed(token) {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE password_resets SET used = 1 WHERE token = ?`,
        [token],
        function(err) {
          if (err) return reject(err);
          resolve(this.changes > 0);
        }
      );
    });
  }
}

module.exports = PasswordReset;