import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './store/store'
import { authApi } from './api/auth'
import { setCredentials } from './store/slices/authSlice'

function AuthInitializer({ children }: { children: React.ReactNode }) {
  console.log('AuthInitializer rendering')
  const dispatch = useAppDispatch()
  const token = useAppSelector(state => state.auth.token)

  useEffect(() => {
    console.log('AuthInitializer effect running, token:', token)
    if (token) {
      authApi.refreshToken()
        .then(response => {
          console.log('Token refresh successful:', response)
          dispatch(setCredentials(response))
        })
        .catch(error => console.error('Token refresh failed:', error))
    }
  }, [dispatch, token])

  return <>{children}</>
}

function App() {
  return <AuthInitializer><RouterProvider router={router} /></AuthInitializer>
}

export default App

