import { Grid, Typography, Box, Paper } from '@mui/material'
import { Trip } from '../../types'
import TripCard from './TripCard'

interface UserTripListProps {
  trips: Trip[]
}

const UserTripList: React.FC<UserTripListProps> = ({ trips }) => {
  return (
    <Box>
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          mb: 3,
          color: 'text.primary',
          fontWeight: 500
        }}
      >
        Your Trips
      </Typography>
      <Grid container spacing={3}>
        {trips.length > 0 ? (
          trips.map((trip) => (
            <Grid item xs={12} sm={6} md={4} key={trip.id}>
              <TripCard trip={trip} />
            </Grid>
          ))
        ) : (
          <Box sx={{ width: '100%' }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                textAlign: 'center',
                border: 1,
                borderColor: 'divider'
              }}
            >
              <Typography variant="h6" color="text.secondary">No trips found</Typography>
            </Paper>
          </Box>
        )}
      </Grid>
    </Box>
  )
}

export default UserTripList