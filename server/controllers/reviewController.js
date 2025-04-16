const { addReview, getReviewsByEventId } = require('../models/reviewModel');

async function add(req, res) {
  try {
      const { event_id, rating, review_text } = req.body;
      const userId = req.user.userId;
      if (!rating || rating < 1 || rating > 5) return res.status(400).json({ error: 'Invalid rating' });
      const reviewId = await addReview(userId, event_id, rating, review_text);
      res.status(201).json({ message: 'Review added', reviewId });
  } catch (error) {
      res.status(500).json({ error: 'Failed to add review' });
  }
}


async function getByEventId(req, res) {
  try {
      const reviews = await getReviewsByEventId(req.params.id);
      res.json(reviews);
  } catch (error) {
      res.status(500).json({ error: 'Failed to fetch reviews' });
  }
}


module.exports = {
  add,
  getByEventId
}