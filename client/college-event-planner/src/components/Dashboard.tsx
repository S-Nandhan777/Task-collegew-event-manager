import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();
    const { user, fetchUserDetails } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchUserDetails().then(() => {
      if (user?.role !== 'organizer') {
        alert('Access restricted to organizers');
        navigate('/');
      }
    });
  }, [user, fetchUserDetails, navigate]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const organizer_id = localStorage.getItem("organizer_id");

        const eventData = {
            title,
            date,
            time,
            location,
            description,
            organizer_id: parseInt(organizer_id || '0'),
        };

        try {
            const response = await axios.post(
                "http://localhost:5000/api/events/create",
                eventData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            console.log("Event created successfully:", response.data);
            alert("Event created!");
        } catch (error) {
            console.error("Error creating event:", error);
            alert("Failed to create event.");
        }
    };

    return (
        <div className="dashboard-container">
            <h2>Create New Event</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <input type="text" placeholder="Event Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
                <div>
                    <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
                </div>
                <div>
                    <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
                <div>
                    <textarea placeholder="Event Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <button type="submit">Create Event</button>
            </form>
            <button onClick={() => {
                localStorage.clear();
                navigate('/login');
            }}>
                Logout
            </button>
        </div>
    );
};

export default Dashboard;
