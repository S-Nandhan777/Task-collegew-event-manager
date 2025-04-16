import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { Event } from '../types';
import { useAuth } from '../context/AuthContext';
import FilterPanel from '../components/FilterPanel';
import SearchBar from '../components/SearchBar';
import EventList from '../components/EventList';
import styles from '../styles/EventList.module.css';

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filters, setFilters] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  // console.log(user);
  

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get<Event[]>('/events');
      console.log('Events response in Home:', response.data); 
      setEvents(response.data);
    } catch (error: any) {
      toast.error('Failed to load events');
      console.error('Fetch events error in Home:', error.response?.data || error.message);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesCategory = filters.length === 0 || filters.includes(event.category_id);
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={styles.container}>
      <div className={styles.heroContainer}>
        <div className={styles.heroOverlay}>
          <h1 className={styles.heroTitle}>{user ? 'Welcome Back!' : 'Welcome to Event Planner!'}</h1>
          <p className={styles.heroSubtitle}>{user ? 'Explore and Manage Your Events' : 'Discover, Plan, and Celebrate Amazing Events'}</p>
          <div className={styles.cardContainer}>
            <div className={styles.animatedCard}>{user ? 'My Events' : 'Event Planning'}
              <p>{user ? 'View and manage your events.' : 'Create and manage events with ease.'}</p>
            </div>
            <div className={styles.animatedCard}>{user ? 'Filter Options' : 'Quick Registration'}
              <p>{user ? 'Find events by category.' : 'Join events in seconds.'}</p>
            </div>
            <div className={styles.animatedCard}>{user ? 'Search Events' : 'Category Explorer'}
              <p>{user ? 'Discover events easily.' : 'Find events by your interests.'}</p>
            </div>
          </div>
          {user ? (
            <Link to="/profile" className={styles.ctaButton}>My Profile</Link>
          ) : (
            <Link to="/register" className={styles.ctaButton}>Get Started</Link>
          )}
          {!user && <p className={styles.loginPrompt}>Already have an account? <Link to="/login">Login</Link></p>}
        </div>
      </div>
      {user && (
        <>
          <SearchBar onSearch={setSearchQuery} />
          <FilterPanel filters={filters} setFilters={setFilters} />
          <EventList events={filteredEvents} />
        </>
      )}
      {!user && (
        <div className={styles.authPrompt}>
          <p>Please <Link to="/login">Login</Link> or <Link to="/register">Register</Link> to explore events.</p>
        </div>
      )}
    </div>
  );
}