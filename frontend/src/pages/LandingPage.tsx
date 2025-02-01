import { Box, Button, Container, Grid, Paper, Typography, useTheme } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import TripCard from '../components/trips/TripCard'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store/store'
import { fetchTrips } from '../store/slices/tripSlice'

const LandingPage = () => {
  const theme = useTheme()
  const dispatch = useDispatch<AppDispatch>()
  const { trips } = useSelector((state: RootState) => state.trips)

  useEffect(() => {
    dispatch(fetchTrips())
  }, [dispatch])

  const featuredTrips = trips.slice(0, 3)

  return (
    <Box>
      {/* Hero Section */}
      <Paper 
        elevation={0}
        sx={{
          p: 6,
          background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
          height: '70vh',
          display: 'flex',
          alignItems: 'center',
          color: 'white',
          borderRadius: 0,
          borderBottom: `1px solid ${theme.palette.divider}`
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom>
            Discover Amazing Motorcycle Trips 🏍️
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
            Join the community of motorcycle enthusiasts and share your adventures
          </Typography>
          <Box sx={{ '& > :not(style)': { mr: 2 } }}>
            <Button
              component={RouterLink}
              to="/register"
              variant="contained"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                backgroundColor: 'white',
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.grey[100],
                }
              }}
            >
              Get Started
            </Button>
            <Button
              component={RouterLink}
              to="/trips"
              variant="outlined"
              size="large"
              sx={{ 
                px: 4,
                py: 1.5,
                color: 'white', 
                borderColor: 'white',
                '&:hover': {
                  borderColor: theme.palette.grey[100],
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Explore Trips
            </Button>
          </Box>
        </Container>
      </Paper>

      {/* Features Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          py: 8,
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" gutterBottom align="center" sx={{ mb: 6 }}>
            Why Choose Our Platform 🏍️
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                title: 'Plan Your Routes',
                description: 'Create and share detailed motorcycle routes with the community'
              },
              {
                title: 'Connect with Riders',
                description: 'Join a community of passionate motorcycle enthusiasts'
              },
              {
                title: 'Share Experiences',
                description: 'Share photos and stories from your motorcycle adventures'
              }
            ].map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    textAlign: 'center', 
                    p: 4,
                    border: `1px solid ${theme.palette.divider}`,
                    backgroundColor: 'white',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[4]
                    }
                  }}
                >
                  <Typography variant="h5" gutterBottom sx={{ color: theme.palette.primary.main }}>
                    {feature.title}
                  </Typography>
                  <Typography>
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Paper>

      {/* Featured Trips Section */}
      <Paper 
        elevation={0}
        sx={{ 
          py: 8,
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" gutterBottom align="center" sx={{ mb: 6 }}>
            Featured Trips 🏍️
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {featuredTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
              />
            ))}
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              component={RouterLink}
              to="/trips"
              variant="contained"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                backgroundColor: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                }
              }}
            >
              View All Trips
            </Button>
          </Box>
        </Container>
      </Paper>

      {/* Call to Action */}
      <Paper 
        elevation={0}
        sx={{ 
          py: 8, 
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.primary.main, 
          color: 'white'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" gutterBottom align="center">
            Ready to Start Your Journey? 🏍️
          </Typography>
          <Typography align="center" sx={{ mb: 4 }}>
            Join our community today and start sharing your motorcycle adventures
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <Button
              component={RouterLink}
              to="/register"
              variant="contained"
              size="large"
              sx={{
                px: 6,
                py: 1.5,
                backgroundColor: 'white',
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.grey[100],
                }
              }}
            >
              Sign Up Now
            </Button>
          </Box>
        </Container>
      </Paper>
    </Box>
  )
}

export default LandingPage
