const pool = require('../config/db');

async function getUserByEmail(email) {
  const [rows] = await pool.execute('SELECT * FROM User WHERE email = ?', [email]);
  return rows[0];
}

async function createUser(name, email, password, phone, year_of_study) {
  const [result] = await pool.execute(
      'INSERT INTO User (name, email, password, phone, year_of_study) VALUES (?, ?, ?, ?, ?)',
      [name, email, password, phone || null, year_of_study || null]
  );
  return result.insertId;
}


async function getUser() {
  const [rows] = await pool.execute('SELECT * FROM User');
  return rows;
}


module.exports = {
  getUserByEmail,
  createUser,
  getUser
}