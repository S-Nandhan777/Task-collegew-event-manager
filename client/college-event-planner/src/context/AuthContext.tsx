import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
import { User, Reminder } from '../types';

const AuthContext = createContext<{
  user: User | null;
  reminders: Reminder[];
  login: (token: string) => void;
  logout: () => void;
  fetchReminders: () => Promise<void>;
  fetchUserDetails: () => Promise<void>;
}>({
  user: null,
  reminders: [],
  login: () => {},
  logout: () => {},
  fetchReminders: async () => {},
  fetchUserDetails: async () => {}
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token);
    if (token) {
      setUser({ token });
      fetchUserDetails().then(() => {
        if (user?.role === 'organizer') window.location.href = '/organizer-dashboard'; 
      });
      fetchReminders();
    }
  }, []);

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get<{ name: string; role: string }>('/users/me');
      const updatedUser = { 
        token: user?.token || '', 
        name: response.data.name, 
        role: response.data.role as 'user' | 'organizer' 
      };
      setUser(updatedUser);
    } catch (error: any) {
      console.error('Fetch user details error:', error.response?.status, error.response?.data || error.message);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchReminders = async () => {
    try {
      const response = await api.get<Reminder[]>('/reminders');
      const now = new Date();
      setReminders(response.data.filter(reminder => {
        const eventTime = new Date(`${reminder.date} ${reminder.time}`);
        return eventTime > now || (eventTime.getTime() - now.getTime() <= 60 * 60 * 1000 && eventTime > now);
      }));
    } catch (error) {
      console.error('Failed to load reminders:', error);
    }
  };

  const login = (token: string) => {
    localStorage.setItem('token', token);
    setUser({ token });
    fetchUserDetails().then(() => {
      if (user?.role === 'organizer') {
        window.location.href = '/dashboard'; // Redirect to dashboard for organizers
      } else {
        window.location.href = '/'; // Redirect to home for users
      }
    });
    fetchReminders();
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setReminders([]);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, reminders, login, logout, fetchReminders, fetchUserDetails }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);