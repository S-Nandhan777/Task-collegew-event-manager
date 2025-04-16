const pool = require('../config/db');

async function getAllCategories() {
    const [rows] = await pool.execute('SELECT * FROM Category');
    return rows;
}

module.exports = { getAllCategories };