import { createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from '../components/common/ProtectedRoute'
import TripList from '../components/trips/TripList'
import TripDetails from '../components/trips/TripDetails'
import LoginForm from '../components/auth/LoginForm'
import Dashboard from '../components/admin/Dashboard'
import Profile from '../pages/Profile'
import UserFeed from '../components/social/UserFeed'
import LandingPage from '../pages/LandingPage'
import RegisterForm from '../components/auth/RegisterForm'
import Layout from '../components/common/Layout'
import NotFound from '../pages/NotFound'
import Gallery from '../pages/Gallery'
import Contact from '../pages/Contact'

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
        path: 'profile',
        element: <Profile />
      },
      {
        path: 'feed',
        element: <UserFeed />
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
        path: '*',
        element: <NotFound />
      }
    ]
  }
])
