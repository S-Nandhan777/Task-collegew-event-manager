import { useEffect, useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Event } from '../types';
import RegistrationForm from '../components/RegistrationForm';
import LoginForm from '../components/LoginForm';
import styles from '../styles/MyEvents.module.css';

export default function Profile() {
  const [events, setEvents] = useState<Event[]>([]);
  const [user] = useState<boolean>(!!localStorage.getItem('token')); // Simplified for demo

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      const response = await api.get<Event[]>('/registrations/my-events');
      setEvents(response.data);
    } catch (error) {
      toast.error('Failed to load events');
      console.log(error);
      
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Profile</h1>
      {user ? (
        <>
          <h2>My Events</h2>
          <div className={styles.eventList}>
            {events.length ? (
              events.map(event => (
                <div key={event.event_id} className={styles.eventItem}>
                  {event.title} - {new Date(event.date).toLocaleDateString()} {event.time}
                </div>
              ))
            ) : (
              <div className={styles.noEvents}>No registered events</div>
            )}
          </div>
        </>
      ) : (
        <>
          <LoginForm />
          <RegistrationForm />
        </>
      )}
    </div>
  );
}