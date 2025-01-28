import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Pages
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import Trips from '../pages/Trips/Trips';
import TripDetails from '../pages/TripDetails/TripDetails';
import CreateTrip from '../pages/CreateTrip/CreateTrip';
import Bookings from '../pages/Bookings/Bookings';
import UserProfile from '../pages/UserProfile/UserProfile';
import AdminDashboard from '../pages/AdminDashboard/AdminDashboard';

// Protected Route Component
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}> = ({ children, requireAuth = true, requireAdmin = false }) => {
  const { user, isLoading, isInitialized } = useAuth();

  if (!isInitialized || isLoading) {
    return null; // Or a loading spinner
  }

  if (requireAuth && !user) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && user?.role !== 'ADMIN') {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/trips" element={<Trips />} />
      <Route path="/trips/:id" element={<TripDetails />} />

      {/* Protected Routes */}
      <Route
        path="/trips/create"
        element={
          <ProtectedRoute>
            <CreateTrip />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings"
        element={
          <ProtectedRoute>
            <Bookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
