import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../../store/store'
import { fetchTrips, filterTrips } from '../../store/slices/tripSlice'
import { RootState } from '../../store/store'
import TripCard from './TripCard'
import TripFilters from './TripFilters'
import { Grid, CircularProgress, Typography, useMediaQuery, useTheme, Box, Container, Paper } from '@mui/material'

const TripList = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { trips, status, error } = useSelector((state: RootState) => state.trips)
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  useEffect(() => {
    dispatch(fetchTrips())
  }, [dispatch])

  const handleFilter = (filters: any) => {
    dispatch(filterTrips(filters))
  }

  if (status === 'loading') {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            border: 1,
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 200
          }}
        >
          <CircularProgress />
        </Paper>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            border: 1,
            borderColor: 'divider',
            textAlign: 'center'
          }}
        >
          <Typography variant="h6" color="error.main" gutterBottom>
            Error Loading Trips
          </Typography>
          <Typography color="error.main" variant="body1">
            {error}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mt: 2 }}
          >
          Please check your connection and try refreshing the page.
          </Typography>
        </Paper>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom 
        sx={{ 
          mb: 4,
          color: 'text.primary',
          fontWeight: 500
        }}
      >
        Explore Motorcycle Trips
      </Typography>
      <TripFilters onFilter={handleFilter} />
      <Box sx={{ mt: 4 }}>
        <Grid 
          container 
          spacing={3} 
          justifyContent={isSmallScreen ? 'center' : 'flex-start'}
        >
          {trips.length > 0 ? (
            trips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
              />
            ))
          ) : (
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  border: 1,
                  borderColor: 'divider',
                  textAlign: 'center'
                }}
              >
                <Typography 
                  variant="h6" 
                  color="text.secondary"
                >
                  No trips found matching your criteria
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>
    </Container>
  )
}

export default TripList
