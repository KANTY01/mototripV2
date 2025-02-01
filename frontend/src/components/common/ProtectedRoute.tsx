import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '../../store/store'
import type { RootState } from '../../store/store'
import { useEffect, useState } from 'react'
import { UserRole } from '../../types/auth'


interface ProtectedRouteProps {
  children: JSX.Element
  roles?: UserRole[]
  skipAuthCheck?: boolean
}

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { isAuthenticated, user, token } = useAppSelector((state: RootState) => state.auth)
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      if (!token || typeof token !== 'string' || token.length === 0) {
        return false
      }
      return true
    }
    
    if (!checkAuth()) {
      setIsLoading(false)
      return
    }
    
    setIsLoading(false)
  }, [token])

  if (isLoading) return <div>Loading...</div>

  // Check authentication
  if (!isAuthenticated || !token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  // Check role requirements
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
