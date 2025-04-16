require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes'); // Add this
const reminderRoutes = require('./routes/reminderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const photoRoutes = require('./routes/photoRoutes');
const organizerRoutes = require('./routes/organizerRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const pool = require('./config/db');
const { authenticateOrganizerToken } = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes); // Add this
app.use('/api/reminders', reminderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/organizers', organizerRoutes);
app.use('/api/categories', categoryRoutes);

const PORT = process.env.PORT || 5000;

pool.getConnection()
  .then(connection => {
    console.log('Database connected successfully!');
    connection.release();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Database connection failed:', err.message);
  });