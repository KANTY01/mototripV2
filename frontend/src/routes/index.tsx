import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';
import TripList from '../components/trips/TripList';
import TripDetails from '../components/trips/TripDetails';
import LoginForm from '../components/auth/LoginForm';
import Dashboard from '../components/admin/Dashboard';
import Profile from '../pages/Profile';
import UserFeed from '../components/social/UserFeed';
import LandingPage from '../pages/LandingPage';
import RegisterForm from '../components/auth/RegisterForm';
import Layout from '../components/common/Layout';
import NotFound from '../pages/NotFound';
import Gallery from '../pages/Gallery';
import Contact from '../pages/Contact';
import Statistics from '../components/admin/Statistics';
import UserManagement from '../components/admin/UserManagement';
import ProfileEditPage from '../pages/ProfileEditPage';
import PremiumContent from '../components/trips/PremiumContent';
import PremiumRoutePlanner from '../components/premium/PremiumRoutePlanner';
import UserTripsContainer from '../components/trips/UserTripsContainer';
import ReviewListContainer from '../components/trips/ReviewListContainer';
import AdminTripRoutes from '../components/admin/AdminTripRoutes';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <LandingPage />
      },
      {
        path: 'trips',
        element: <TripList />
      },
      {
        path: 'trips/:id',
        element: <TripDetails />
      },
      {
        path: 'trips/:id/premium',
        element: (
          <ProtectedRoute roles={['premium', 'admin']}>
            <PremiumContent />
          </ProtectedRoute>
        )
      },
      {
        path: 'premium/content',
        element: (
          <ProtectedRoute roles={['premium', 'admin']}>
            <PremiumContent />
          </ProtectedRoute>
        )
      },
      {
        path: 'premium/routes',
        element: (
          <ProtectedRoute roles={['premium', 'admin']}>
            <PremiumRoutePlanner />
          </ProtectedRoute>
        )
      },
      {
        path: 'my-trips',
        element: (
          <ProtectedRoute>
            <UserTripsContainer />
          </ProtectedRoute>
        )
      },
      {
        path: 'my-reviews',
        element: (
          <ProtectedRoute>
            <ReviewListContainer userOnly={true} />
          </ProtectedRoute>
        )
      },
      {
        path: 'register',
        element: <RegisterForm />
      },
      {
        path: 'login',
        element: <LoginForm />
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute roles={['admin']}>
            <Dashboard />
          </ProtectedRoute>
        )
      },
      {
        path: 'admin/statistics',
        element: (
          <ProtectedRoute roles={['admin']}>
            <Statistics />
          </ProtectedRoute>
        )
      },
      {
        path: 'admin/trips/*',
        element: (
          <ProtectedRoute roles={['admin']}>
            <AdminTripRoutes />
          </ProtectedRoute>
        )
      },
      {
        path: 'admin/users',
        element: (
          <ProtectedRoute roles={['admin']}>
            <UserManagement />
          </ProtectedRoute>
        )
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        )
      },
      {
        path: 'feed',
        element: (
          <ProtectedRoute>
            <UserFeed />
          </ProtectedRoute>
        )
      },
      {
        path: 'gallery',
        element: <Gallery />
      },
      {
        path: 'contact',
        element: <Contact />
      },
      {
        path: 'profile/edit',
        element: (
          <ProtectedRoute>
            <ProfileEditPage />
          </ProtectedRoute>
        )
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
]);
