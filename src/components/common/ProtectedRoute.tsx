import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../../store/store'
import type { RootState } from '../../store/store'
import { UserRole } from '../../types/auth'

interface ProtectedRouteProps {
  children: JSX.Element
  roles?: UserRole[]
}

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAppSelector((state: RootState) => state.auth)
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
