import { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import styles from '../styles/ReviewForm.module.css';

export default function ReviewForm({ eventId, onReviewAdded }: { eventId: number; onReviewAdded: () => void }) {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/reviews', { event_id: eventId, rating, review_text: reviewText });
      toast.success('Review submitted');
      setRating(0);
      setReviewText('');
      onReviewAdded();
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.reviewForm}>
      <input
        type="number"
        value={rating}
        onChange={(e) => setRating(parseInt(e.target.value))}
        min="1"
        max="5"
        placeholder="Rating (1-5)"
        className={styles.input}
      />
      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="Write your review"
        className={styles.textarea}
      />
      <button type="submit" className={styles.submitButton}>Submit</button>
    </form>
  );
}