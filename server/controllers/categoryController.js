const { getAllCategories } = require('../models/categoryModel');

async function getAll(req,res) {
  try {
    const categories = await getAllCategories();
    res.json(categories)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
}

module.exports = {
  getAll
}