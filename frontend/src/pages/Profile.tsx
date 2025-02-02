import { Box, Container, Grid, Paper, CircularProgress, Alert, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { fetchProfile } from '../store/slices/userSlice';
import { User } from '../types/auth';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileDetails from '../components/profile/ProfileDetails';
import Achievements from '../components/profile/Achievements';

const Profile = () => {
  const dispatch = useAppDispatch();
  const { profile, status, error } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  if (status === 'loading' || status === 'idle') {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (status === 'failed') {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (status === 'succeeded' && !profile) {
    return null;
  }

  const handleProfileUpdate = async (updatedData: any) => {
    // Handle profile update logic here
    console.log('Updating profile:', updatedData);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            {profile && <ProfileHeader user={profile} />}
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            {profile && <ProfileDetails user={profile} />}
          </Paper>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            {profile && <Achievements userId={profile.id} />}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
