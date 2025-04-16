import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Event, Review, Photo } from '../types';
import ReviewForm from '../components/ReviewForm';
import PhotoGallery from '../components/PhotoGallery';
import ShareButton from '../components/ShareButton';
import styles from '../styles/EventDetails.module.css';

export default function EventPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [registered, setRegistered] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetchEvent();
    checkRegistration();
    fetchReviews();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await api.get<Event>(`/events/${id}`);
      setEvent(response.data);
    } catch (error) {
      toast.error('Failed to load event');
    }
  };

  const checkRegistration = async () => {
    try {
      const response = await api.get<{ registered: boolean }>(`/registrations/check/${id}`);
      setRegistered(response.data.registered);
    } catch (error) {
      toast.error('Failed to check registration');
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await api.get<Review[]>(`/reviews/${id}`);
      setReviews(response.data);
    } catch (error) {
      toast.error('Failed to load reviews');
    }
  };

  const handleRegister = async () => {
    try {
      await api.post('/registrations', { event_id: Number(id) });
      setRegistered(true);
      toast.success('Registered successfully');
    } catch (error) {
      toast.error('Registration failed');
    }
  };

  const handleCancel = async () => {
    try {
      await api.delete(`/registrations/${id}`);
      setRegistered(false);
      toast.success('Registration cancelled');
    } catch (error) {
      toast.error('Cancellation failed');
    }
  };

  if (!event) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{event.title}</h1>
      <p className={styles.details}>Date: {new Date(event.date).toLocaleDateString()} {event.time}</p>
      <p className={styles.details}>Location: {event.location}</p>
      <p className={styles.description}>{event.description}</p>
      <p className={styles.organizer}>Organized by: {event.organizer_name}</p>
      <div className={styles.actions}>
        {!registered ? (
          <button onClick={handleRegister} className={styles.registerButton}>Register</button>
        ) : (
          <button onClick={handleCancel} className={styles.cancelButton}>Cancel Registration</button>
        )}
        <ShareButton eventId={Number(id)} />
      </div>
      <ReviewForm eventId={Number(id)} onReviewAdded={fetchReviews} />
      <PhotoGallery eventId={Number(id)} />
      <div className={styles.reviews}>
        <h2>Reviews</h2>
        {reviews.length ? (
          reviews.map(review => (
            <div key={review.review_id} className={styles.review}>
              <span className={styles.reviewAuthor}>{review.name}:</span> {review.rating} stars - {review.review_text}
            </div>
          ))
        ) : (
          <div>No reviews yet</div>
        )}
      </div>
    </div>
  );
}