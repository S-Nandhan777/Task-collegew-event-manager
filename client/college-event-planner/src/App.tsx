import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import OrganizerDashboard from './pages/OrganizerDashboard';
import EventDetails from './pages/EventPage';
import Profile from './pages/Profile';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

const AppContent = () => {
  const { loading } = useAuth(); // Remove unused 'user' destructuring

  if (loading) {
    return <div>Loading application...</div>; // Or a spinner component
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
      <Route path="/event/:id" element={<EventDetails />} />
      <Route path="/profile" element={<Profile />} />
      <Route element={<ProtectedRoute requiredRole="organizer" />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <AppContent />
        <ToastContainer />
      </Router>
    </AuthProvider>
  );
}

export default App;