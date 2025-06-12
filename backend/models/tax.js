const db = require('../database');

class TaxSelection {
  static create(userId, regime, financialYear) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO tax_selections (user_id, regime, financial_year) 
         VALUES (?, ?, ?)`,
        [userId, regime, financialYear],
        function(err) {
          if (err) return reject(err);
          resolve(this.lastID);
        }
      );
    });
  }

  static findByUserAndYear(userId, financialYear) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM tax_selections 
         WHERE user_id = ? AND financial_year = ?
         ORDER BY switched_at DESC LIMIT 1`,
        [userId, financialYear],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });
  }

  static countByUserAndYear(userId, financialYear) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT COUNT(*) as count FROM tax_selections 
         WHERE user_id = ? AND financial_year = ?`,
        [userId, financialYear],
        (err, row) => {
          if (err) return reject(err);
          resolve(row.count);
        }
      );
    });
  }

  static getHistory(userId) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM tax_selections 
         WHERE user_id = ? 
         ORDER BY switched_at DESC`,
        [userId],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  }
}

module.exports = TaxSelection;