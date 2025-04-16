import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import api from '../services/api';
import { User, Reminder } from '../types';
import { jwtDecode } from 'jwt-decode'; // Named import

type AuthContextType = {
  user: User | null;
  reminders: Reminder[];
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
  fetchReminders: () => Promise<void>;
  fetchUserDetails: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  reminders: [],
  loading: false,
  login: () => {},
  logout: () => {},
  fetchReminders: async () => {},
  fetchUserDetails: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUserDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<{ name: string; role: string }>('/users/me');
      console.log('User details response:', response.data); // Debug
      const updatedUser: User = {
        token: user?.token || '',
        name: response.data.name,
        role: response.data.role as 'user' | 'organizer',
      };
      setUser(updatedUser);
    } catch (error: any) {
      console.error('Fetch user details error:', error.response?.status, error.response?.data || error.message);
      // Only clear token and user if authentication fails (e.g., 401)
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  const fetchReminders = useCallback(async () => {
    try {
      const response = await api.get<Reminder[]>('/reminders');
      const now = new Date();
      setReminders(
        response.data.filter((reminder) => {
          const eventTime = new Date(`${reminder.date} ${reminder.time}`);
          return eventTime > now || (eventTime.getTime() - now.getTime() <= 60 * 60 * 1000 && eventTime > now);
        })
      );
    } catch (error) {
      console.error('Failed to load reminders:', error);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode<{ userId: number; role: 'user' | 'organizer'; iat?: number; exp?: number }>(token);
      console.log('Decoded token on mount:', decodedToken);
      const initialUser: User = {
        token,
        name: '', // Default name, to be updated by fetchUserDetails
        role: decodedToken.role,
      };
      setUser(initialUser);
      fetchUserDetails();
      fetchReminders();
    }
  }, [fetchUserDetails, fetchReminders]);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    const decodedToken = jwtDecode<{ userId: number; role: 'user' | 'organizer'; iat?: number; exp?: number }>(token);
    console.log('Decoded token on login:', decodedToken);
    const initialUser: User = {
      token,
      name: '', // Default name, to be updated by fetchUserDetails
      role: decodedToken.role,
    };
    setUser(initialUser);
    fetchUserDetails().then(() => {
      setUser((prev) => {
        if (!prev) {
          console.log('User is null after fetchDetails, unexpected state');
          return null;
        }
        console.log('User state after fetchDetails:', prev);
        return prev;
      });
    }).catch((error) => {
      console.error('Error in fetchUserDetails during login:', error);
    });
    fetchReminders();
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setReminders([]);
    console.log('Logging out, redirecting to home');
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, reminders, loading, login, logout, fetchReminders, fetchUserDetails }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => useContext(AuthContext);