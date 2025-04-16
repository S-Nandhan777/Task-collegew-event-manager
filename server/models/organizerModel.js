const pool = require('../config/db');

async function getOrganizerById(id) {

  const [rows] = await pool.execute('SELECT * FROM Organizer WHERE organizer_id = ?',
    [id]);
  return rows[0];
}

module.exports = { getOrganizerById };
