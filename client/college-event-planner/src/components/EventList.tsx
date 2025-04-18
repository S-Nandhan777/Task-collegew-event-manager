import { Event } from '../types';
import styles from '../styles/EventList.module.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';


type EventListProps = {
  events: Event[];
};
// interface events {
//   event_id:number,
//   title: string,
//   date: string,
//   time:string,
//   location: string,
//   description: string,
//   organizer_id: number
//   organizer_name:string
// }

// {
//   "event_id": 1,
//   "title": "Tech Talk",
//   "date": "2025-04-15T18:30:00.000Z",
//   "time": "14:00:00",
//   "location": "Hall A",
//   "description": "A talk on tech trends",
//   "organizer_id": 1,
//   "organizer_name": "Tech Club"
// }

export default function EventList ({ events }: EventListProps) {
  const [filters, setFilters] = useState([]);
  const [event, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events', { params: { categories: filters.join(',') } });
      setEvents(response.data);
    } catch (error) {
      toast.error('Failed to load events');
    }
  };
  return (
    <div className={styles.eventList}>
      {event.length ? (
        event.map(event => (
          <Link to={`/event/${event.event_id}`} key={event.event_id} className={styles.eventItem}>
            <div className={styles.eventTitle}>{event.title}</div>
            <div className={styles.eventDate}>
              {new Date(event.date).toLocaleDateString()} {event.time}
            </div>
          </Link>
        ))
      ) : (
        <div className={styles.noEvents}>No events found</div>
      )}
    </div>
  );
}