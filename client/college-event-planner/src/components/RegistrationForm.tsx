import { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import styles from '../styles/RegistrationForm.module.css';
import { useNavigate } from 'react-router-dom';
import RegistrationFormOrganizer from './RegistrationFormOrganizer';

export default function RegistrationForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    year_of_study: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/users/register', form);
      toast.success('Registration successful');
      setForm({ name: '', email: '', password: '', phone: '', year_of_study: '' });
      navigate('/login');console.log('Registration form submitted with data:', form);
console.error('Registration failed with error:', Error);
    } catch (error:any) {
      toast.error(error.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h3>User Registration</h3>
      <input
        type="text"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="Name"
        className={styles.input}
        required
      />
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
      <input
        type="text"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        placeholder="Phone (optional)"
        className={styles.input}
      />
      <input
        type="number"
        value={form.year_of_study}
        onChange={(e) => setForm({ ...form, year_of_study: e.target.value })}
        placeholder="Year of Study (optional)"
        className={styles.input}
      />
      <button type="submit" className={styles.submitButton}>Register</button>
      </form>
      
      <RegistrationFormOrganizer />
    </>
   
  );
}