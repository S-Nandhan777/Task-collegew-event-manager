import { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/LoginForm.module.css';
import LoginFormOrganizer from './LoginOrganizerForm';

export default function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/users/login', form);
      login(response.data.token);
      toast.success('Logged in successfully');
      navigate('/');
    } catch (error) {
      toast.error('Invalid credentials');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h3>User Login</h3>
      <input
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        placeholder="Email"
        className={styles.input}
        required
      />
      <input
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        placeholder="Password"
        className={styles.input}
        required
      />
      <button type="submit" className={styles.submitButton}>Login</button>
      </form>
      <LoginFormOrganizer/>
    </>
   
  );
}