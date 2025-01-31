import { Card, CardContent, CardMedia, Typography, Button, useMediaQuery, useTheme, Grid } from '@mui/material'
import { Trip } from '../../types'
import { useNavigate } from 'react-router-dom'

interface TripCardProps {
  trip: Trip
}

const TripCard = ({ trip }: TripCardProps) => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card sx={{ maxWidth: isSmallScreen ? '100%' : 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {trip.images && trip.images.length > 0 && (
          <CardMedia
            component="img"
            height="140"
            image={trip.images[0]}
            alt={trip.title}
          />
        )}
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h5" component="div">
            {trip.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {trip.description.substring(0, 100)}...
          </Typography>
        </CardContent>
        <Button
          size="small"
          onClick={() => navigate(`/trips/${trip.id}`)}
          sx={{ mt: 'auto', alignSelf: 'flex-start', ml: 2, mb: 2 }}
        >
          View Details
        </Button>
      </Card>
    </Grid>
  )
}

export default TripCard
