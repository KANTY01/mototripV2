import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, CircularProgress, Alert, Container } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchProfile, updateProfile } from '../store/slices/userSlice'
import ProfileEdit from '../components/profile/ProfileEdit'
import { User } from '../types'

// Import ProfileUpdate type from the API
import { ProfileUpdate } from '../api/users'

const ProfileEditPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { profile, status, error } = useAppSelector((state) => state.user)

  useEffect(() => {
    dispatch(fetchProfile())
  }, [dispatch])

  if (status === 'loading') {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    )
  }

  if (status === 'failed') {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    )
  }

  if (!profile) {
    return null
  }

  const handleSave = async (updatedData: ProfileUpdate) => {
    try {
      await dispatch(updateProfile(updatedData)).unwrap()
      navigate('/profile')
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  const handleCancel = () => {
    navigate('/profile')
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <ProfileEdit 
        initialData={profile}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </Container>
  )
}

export default ProfileEditPage