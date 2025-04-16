import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import styles from '../styles/Auth.module.css'; // Ensure correct import

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [description, setDescription] = useState('');
  const [role, setRole] = useState<'user' | 'organizer'>('user');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (role === 'organizer') {
        await api.post('/organizers/register', { name, email, password, description });
        toast.success('Registration successful! Please login as an organizer.');
        navigate('/login');
        return;
      } else if (role === 'user') { 
        const response = await api.post('/users/register', { name, email, password, role });
      toast.success('Registration successful! Please login.');
      navigate('/login');
      }
      
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className={styles.authForm}>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required className={styles.input} />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className={styles.input} />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className={styles.input} />
        {role === 'organizer' && (
           <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required className={styles.input} />
        )}
        <select value={role} onChange={(e) => setRole(e.target.value as 'user' | 'organizer')} className={styles.select}>
          <option value="user">Attendee</option>
          <option value="organizer">Organizer</option>
        </select>
        <button type="submit" className={styles.button}>Register</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}