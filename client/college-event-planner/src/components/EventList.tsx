import { Event } from '../types';
import styles from '../styles/EventList.module.css';
import { Link } from 'react-router-dom';

interface EventListProps {
  events: Event[];
}

export default function EventList({ events }: EventListProps) {
  return (
    <div className={styles.eventList}>
      {events.length ? (
        events.map(event => (
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