import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../../store/store'
import { fetchTrips, filterTrips } from '../../store/slices/tripSlice'
import { RootState } from '../../store/store'
import TripCard from './TripCard'
import TripFilters from './TripFilters'
import { Grid, CircularProgress, Typography, useMediaQuery, useTheme, Box, Container } from '@mui/material'

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

  if (error) {
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
          Error Loading Trips
        </Typography>
        <Typography color="error.main">
          {error}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Please check your connection and try refreshing the page.
        </Typography>
      </Box>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Explore Motorcycle Trips
      </Typography>
      <TripFilters onFilter={handleFilter} />
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={3} justifyContent={isSmallScreen ? 'center' : 'flex-start'}>
          {trips.length > 0 ? (
            trips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
              />
            ))
          ) : (
            <Box sx={{ 
              width: '100%', 
              textAlign: 'center', 
              py: 8 
            }}>
              <Typography variant="h6" color="text.secondary">
                No trips found matching your criteria
              </Typography>
            </Box>
          )}
        </Grid>
      </Box>
    </Container>
  )
}

export default TripList
