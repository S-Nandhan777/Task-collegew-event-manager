import { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import styles from '../styles/RegistrationForm.module.css';
import { useNavigate } from 'react-router-dom';

export default function RegistrationFormOrganizer() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: '',
    contact_info: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/organizers/register', form);
      toast.success('Registration successful');
      setForm({ name: '', description: '', contact_info: '' });
      navigate('/login');  // Redirect to login after successful registration
      console.log('Registration form submitted with data:', form);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div>
        <h3>Organizer Registration</h3>
      </div>
      <input
        type="text"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="Name"
        className={styles.input}
        required
      />
      <input
        type="text"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        placeholder="Description"
        className={styles.input}
      />
      <input
        type="text"
        value={form.contact_info}
        onChange={(e) => setForm({ ...form, contact_info: e.target.value })}
        placeholder="Contact Info"
        className={styles.input}
      />

      <button type="submit" className={styles.submitButton}>Register</button>
    </form>
  );
}
