const db = require('../database');
const bcrypt = require('bcryptjs');

class User {
  static create({ personnel_no, name, email, contact_no, password, level }) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return reject(err);
        
        db.run(
          `INSERT INTO users (personnel_no, name, email, contact_no, password, level) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [personnel_no, name, email, contact_no, hashedPassword, level],
          function(err) {
            if (err) return reject(err);
            resolve(this.lastID);
          }
        );
      });
    });
  }

  static findByPersonnelNo(personnel_no) {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM users WHERE personnel_no = ?',
        [personnel_no],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });
  }

  static findByEmail(email) {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });
  }

  static comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }
}

module.exports = User;