import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../services/api';
import styles from '../styles/Dashboard.module.css'; // Ensure correct import

export default function OrganizerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [eventId, setEventId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<number>(1);

  if (!user || user.role !== 'organizer') {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.post('/events/create', {
        title, date, time, location, description,  eventId
      });
      toast.success('Event created successfully!');
      navigate('/');
      const resetForm = e.target as HTMLFormElement;
      resetForm.reset();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Event creation failed');
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <h2>Create New Event</h2>
      <form onSubmit={handleSubmit} className={styles.dashboardForm} id='form'>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event Title" required className={styles.input} />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className={styles.input} />
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required className={styles.input} />
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" required className={styles.input} />
        <input type="number" value={eventId} onChange={(e) => setEventId(e.target.value)} placeholder="EventId" required className={styles.input} />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required className={styles.textarea} />
        
        <button type="submit" className={styles.button}>Create Event</button>
      </form>
    </div>
  );
}