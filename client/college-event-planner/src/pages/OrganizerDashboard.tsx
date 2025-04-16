import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../services/api';
import styles from '../styles/Dashboard.module.css'; // Ensure correct import

export default function OrganizerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<number>(1);

  if (!user || user.role !== 'organizer') {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/events', {
        title, date, time, location, description, category_id: categoryId, organizer_name: user.name
      });
      toast.success('Event created successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Event creation failed');
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <h2>Create New Event</h2>
      <form onSubmit={handleSubmit} className={styles.dashboardForm}>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event Title" required className={styles.input} />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className={styles.input} />
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required className={styles.input} />
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" required className={styles.input} />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required className={styles.textarea} />
        <select value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))} className={styles.select}>
          <option value={1}>Music</option>
          <option value={2}>Sports</option>
          <option value={3}>Tech</option>
        </select>
        <button type="submit" className={styles.button}>Create Event</button>
      </form>
    </div>
  );
}