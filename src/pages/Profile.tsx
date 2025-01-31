import { Box, Container, Grid, Paper, CircularProgress, Alert } from '@mui/material'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/store'
import { fetchProfile } from '../store/slices/userSlice'
import ProfileHeader from '../components/profile/ProfileHeader'
import ProfileDetails from '../components/profile/ProfileDetails'
import ProfileEdit from '../components/profile/ProfileEdit'

const Profile = () => {
  const dispatch = useAppDispatch()
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
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <ProfileHeader />
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <ProfileDetails />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <ProfileEdit />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Profile
