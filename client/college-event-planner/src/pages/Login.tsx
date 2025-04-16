import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import styles from '../styles/Auth.module.css';
import api from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'organizer'>('user');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (role === 'user') {
        const response = await api.post('/users/login', { email, password ,role});
        login(response.data.token);
        toast.success('Login successful!');
        navigate('/');
      } else if (role === 'organizer') {
        const response = await api.post('/organizers/login', { email, password,role });
        login(response.data.token);
        toast.success('Login successful!');
        navigate('/dashboard');
       }
      
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className={styles.authForm}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <select value={role} onChange={(e) => setRole(e.target.value as 'user' | 'organizer')} className={styles.select}>
          <option value="user">Attendee</option>
          <option value="organizer">Organizer</option>
        </select>
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <Link to="/register">Register</Link></p>
    </div>
  );
}