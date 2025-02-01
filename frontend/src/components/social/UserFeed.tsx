import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Theme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { AppDispatch } from '../../store/store';
import { fetchUserFeed } from '../../store/slices/socialSlice';
import { RootState } from '../../store/store';
import { Box, Typography, CircularProgress } from '@mui/material';
import TripCard from '../trips/TripCard';

const UserFeed: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { feed, status } = useSelector((state: RootState) => state.social);

  useEffect(() => {
    dispatch(fetchUserFeed());
  }, [dispatch]);

  return (
    <StyledBox sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Your Feed
      </Typography>

      {status === 'loading' && <CircularProgress size={40} />}

      {feed.map((trip) => (
        <Box key={trip.id} sx={{ mb: 3 }}>
          <TripCard 
            trip={trip} 
            onViewDetails={() => dispatch({ type: 'trips/viewTrip', payload: trip.id })} 
          />
        </Box>
      ))}
    </StyledBox>
  );
};

const StyledBox = styled(Box)(({ theme }: { theme: Theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  '&:hover': { boxShadow: 'none', borderColor: theme.palette.action.hover }
}));

export default UserFeed;
