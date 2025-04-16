import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Event, Review, Photo } from '../types';
import ReviewForm from './ReviewForm';
import PhotoGallery from './PhotoGallery';
import ShareButton from './ShareButton';
import styles from '../styles/EventDetails.module.css';

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [registered, setRegistered] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState({ registration: false, event: true, reviews: true });

  useEffect(() => {
    if (!id) {
      toast.error('Invalid event ID');
      navigate('/');
      return;
    }
    console.log('EventDetails mounted with id:', id); // Debug
    fetchEvent();
    checkRegistration();
    fetchReviews();
  }, [id, navigate]);

  const fetchEvent = async () => {
    setLoading(prev => ({ ...prev, event: true }));
    try {
      console.log(`Fetching event with ID: ${id}`); // Debug
      const response = await api.get<Event>(`/events/${id}`);
      console.log('Event response:', response.data); // Debug
      setEvent(response.data);
    } catch (error: any) {
      toast.error('Failed to load event');
      console.error('Fetch event error:', error.response?.status, error.response?.data || error.message);
      navigate('/'); // Redirect on failure
    } finally {
      setLoading(prev => ({ ...prev, event: false }));
    }
  };

  const checkRegistration = async () => {
    try {
      const response = await api.get<{ registered: boolean }>(`/registrations/check/${id}`);
      setRegistered(response.data.registered);
    } catch (error: any) {
      toast.error('Failed to check registration');
      console.error('Check registration error:', error.response?.status, error.response?.data || error.message);
    } finally {
      setLoading(prev => ({ ...prev, registration: false }));
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await api.get<Review[]>(`/reviews/${id}`);
      setReviews(response.data);
    } catch (error: any) {
      toast.error('Failed to load reviews');
      console.error('Fetch reviews error:', error.response?.status, error.response?.data || error.message);
    } finally {
      setLoading(prev => ({ ...prev, reviews: false }));
    }
  };

  const handleRegister = async () => {
    if (registered) {
      toast.error('You are already registered for this event!');
      return;
    }
    setLoading(prev => ({ ...prev, registration: true }));
    try {
      await api.post('/registrations', { event_id: Number(id) });
      setRegistered(true);
      toast.success('Registered successfully');
      await checkRegistration();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Registration failed');
      console.error('Register error:', error.response?.status, error.response?.data || error.message);
    } finally {
      setLoading(prev => ({ ...prev, registration: false }));
    }
  };

  const handleCancel = async () => {
    setLoading(prev => ({ ...prev, registration: true }));
    try {
      await api.delete(`/registrations/${id}`);
      setRegistered(false);
      toast.success('Registration cancelled');
      await checkRegistration();
    } catch (error: any) {
      toast.error('Cancellation failed');
      console.error('Cancel error:', error.response?.status, error.response?.data || error.message);
    } finally {
      setLoading(prev => ({ ...prev, registration: false }));
    }
  };

  if (loading.event || !event) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{event.title}</h1>
      <p className={styles.details}>Date: {new Date(event.date).toLocaleDateString()} {event.time}</p>
      <p className={styles.details}>Location: {event.location}</p>
      <p className={styles.description}>{event.description}</p>
      <p className={styles.organizer}>Organized by: {event.organizer_name}</p>
      <div className={styles.actions}>
        <button
          onClick={handleRegister}
          className={styles.registerButton}
          disabled={loading.registration || registered}
        >
          {loading.registration ? 'Processing...' : 'Register'}
        </button>
        {registered && (
          <button
            onClick={handleCancel}
            className={styles.cancelButton}
            disabled={loading.registration}
          >
            {loading.registration ? 'Processing...' : 'Cancel Registration'}
          </button>
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