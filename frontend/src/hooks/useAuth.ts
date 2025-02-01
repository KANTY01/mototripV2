import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../store/store'

export const useAuth = () => {
  const { 
    isAuthenticated, 
    user,
    token
  } = useSelector((state: RootState) => state.auth)
  
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect to login if not authenticated and no token
    if (!isAuthenticated && !token) {
      navigate('/login')
    }
  }, [isAuthenticated, token, navigate])
 
  return { 
    isAuthenticated, 
    user, 
    isAdmin: user?.role === 'admin',
    hasValidToken: !!token
  }
}
