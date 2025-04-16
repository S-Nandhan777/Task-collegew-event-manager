import { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import styles from '../styles/LoginForm.module.css';
import { useNavigate } from 'react-router-dom';

export default function LoginFormOrganizer() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/organizers/login', form);
      toast.success('Login successful');
      localStorage.setItem('authToken', response.data.token); // Store JWT token in localStorage
      navigate('/dashboard');  // Redirect to dashboard or a protected route
      console.log('Login form submitted with data:', form);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div>
        <h3>Organizer Login</h3>
      </div>
      <input
        type="text"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="Name"
        className={styles.input}
        required
      />

      <button type="submit" className={styles.submitButton}>Login</button>
    </form>
  );
}
