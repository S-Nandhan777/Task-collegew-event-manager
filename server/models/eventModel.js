const pool = require('../config/db');

async function getAllEvents() {
    const [rows] = await pool.execute(
        'SELECT e.*, o.name AS organizer_name FROM Event e LEFT JOIN Organizer o ON e.organizer_id = o.organizer_id ORDER BY e.date, e.time'
    );
    return rows;
}

async function getEventById(id) {
    const [rows] = await pool.execute(
        'SELECT e.*, o.name AS organizer_name FROM Event e LEFT JOIN Organizer o ON e.organizer_id = o.organizer_id WHERE e.event_id = ?',
        [id]
    );
    return rows[0];
}

module.exports = { getAllEvents, getEventById };