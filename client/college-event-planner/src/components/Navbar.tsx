import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Navbar.module.css';
import ReminderDropdown from './ReminderDropdown';

export default function Navbar() {
  const { user, reminders, logout } = useAuth();
  const [showReminders, setShowReminders] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setShowReminders(false);
    navigate('/');
  };

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.navLink}>Home</Link>
      {user && user.role === 'organizer' && (
        <Link to="/organizer-dashboard" className={styles.navLink}>Dashboard</Link>
      )}
      <Link to="/profile" className={styles.navLink}>Profile</Link>
      <div className={styles.authSection}>
        {user ? (
          <>
            <span className={styles.userName}>Welcome, {user.name || 'User'}</span>
            <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/register" className={styles.navLink}>Register</Link>
            <Link to="/login" className={styles.navLink}>Login</Link>
          </>
        )}
      </div>
      {user && (
        <div className={styles.reminderContainer}>
          <div className={styles.reminderIcon} onClick={() => setShowReminders(!showReminders)}>
            🔔 {reminders.length}
          </div>
          {showReminders && <ReminderDropdown reminders={reminders} onClose={() => setShowReminders(false)} />}
        </div>
      )}{
        
      }
    </nav>
  );
}