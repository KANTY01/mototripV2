import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Chip,
  Button,
  CircularProgress,
  ImageList,
  ImageListItem,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material'
import {
  CalendarMonth as CalendarIcon,
  Route as RouteIcon,
  Speed as SpeedIcon,
  Person as PersonIcon
} from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import PremiumContent from './PremiumContent'
import { AppDispatch, RootState } from '../../store/store'
import { fetchTrip } from '../../store/slices/tripSlice'
import ReviewList from '../trips/ReviewList'
import ReviewForm from './ReviewForm'

const TripDetails = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'))
  const { selectedTrip: trip, status, error } = useSelector((state: RootState) => state.trips)
  const [showReviewForm, setShowReviewForm] = useState(false)

  useEffect(() => {
    if (id) {
      dispatch(fetchTrip(Number(id)))
    }
  }, [dispatch, id])

  if (status === 'loading') {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: 'calc(100vh - 200px)'
      }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error || !trip) {
    return (
      <Box sx={{ 
        p: 3, 
        textAlign: 'center',
        minHeight: 'calc(100vh - 200px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <Typography variant="h6" color="error" gutterBottom>
          Error Loading Trip
        </Typography>
        <Typography color="error.main">
          {error || 'Trip not found'}
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/trips')}
          sx={{ mt: 2, alignSelf: 'center' }}
        >
          Back to Trips
        </Button>
      </Box>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Title Section with Hero Background */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          bgcolor: 'primary.main',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          border: 1
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
          }}
        >
          {trip.title}
        </Typography>
        {trip.is_premium && (
          <Chip
            label="Premium Trip"
            color="warning"
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              bgcolor: 'warning.main',
              color: 'warning.contrastText'
            }}
          />
        )}
      </Paper>

      {/* Trip Info Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              border: 1,
              borderColor: 'divider'
            }}
          >
            <Box
              sx={{
                backgroundColor: 'primary.light',
                borderRadius: '50%',
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CalendarIcon color="primary" />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Duration
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              border: 1,
              borderColor: 'divider'
            }}
          >
            <Box
              sx={{
                backgroundColor: 'primary.light',
                borderRadius: '50%',
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <RouteIcon color="primary" />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Distance
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {trip.distance} km
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              border: 1,
              borderColor: 'divider'
            }}
          >
            <Box
              sx={{
                backgroundColor: 'primary.light',
                borderRadius: '50%',
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <SpeedIcon color="primary" />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Difficulty
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {trip.difficulty}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              border: 1,
              borderColor: 'divider'
            }}
          >
            <Box
              sx={{
                backgroundColor: 'primary.light',
                borderRadius: '50%',
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <PersonIcon color="primary" />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Created by
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {trip.user?.username || 'Unknown'}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Description */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          mb: 4,
          border: 1,
          borderColor: 'divider'
        }}
      >
        <Typography 
          variant="h5" 
          gutterBottom
          sx={{
            fontWeight: 600,
            color: 'primary.main',
            mb: 3
          }}
        >
          Description
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            whiteSpace: 'pre-line',
            lineHeight: 1.8,
            color: 'text.primary'
          }}
        >
          {trip.description}
        </Typography>
        {trip.is_premium && (
          <PremiumContent />
        )}
      </Paper>

      {/* Images */}
      {trip.images && trip.images.length > 0 && (
        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            mb: 4,
            border: 1,
            borderColor: 'divider'
          }}
        >
          <Typography 
            variant="h5" 
            gutterBottom
            sx={{
              fontWeight: 600,
              color: 'primary.main',
              mb: 3
            }}
          >
            Photos
          </Typography>
          <ImageList
            variant="masonry"
            cols={isSmallScreen ? 1 : isMediumScreen ? 2 : 3}
            gap={16}
            sx={{
              '& .MuiImageListItem-root': {
                overflow: 'hidden',
                '& img': {
                  transition: 'transform 0.3s ease, filter 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    filter: 'brightness(1.05)'
                  }
                }
              }
            }}
          >
            {trip.images.map((image, index) => (
              <ImageListItem 
                key={index}
                sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: 1,
                  borderColor: 'divider'
                }}
              >
                <img
                  src={image}
                  alt={`Trip image ${index + 1}`}
                  loading="lazy"
                  style={{ 
                    borderRadius: `${theme.shape.borderRadius}px`,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Paper>
      )}

      {/* Reviews Section */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 4,
          border: 1,
          borderColor: 'divider'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography 
            variant="h5"
            sx={{
              fontWeight: 600,
              color: 'primary.main'
            }}
          >
            Reviews
          </Typography>
          <Button
            variant="contained"
            onClick={() => setShowReviewForm(!showReviewForm)}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 3
            }}
          >
            {showReviewForm ? 'Cancel Review' : 'Write Review'}
          </Button>
        </Box>

        {showReviewForm && (
          <>
            <ReviewForm tripId={trip.id} onSuccess={() => setShowReviewForm(false)} />
            <Divider sx={{ my: 4 }} />
          </>
        )}

        <ReviewList tripId={trip.id} />
      </Paper>
    </Container>
  )
}

export default TripDetails
