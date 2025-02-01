import { Box, Typography, Paper, Grid, Container } from '@mui/material'
import UserManagement from './UserManagement'
import TripManagement from './TripManagement'
import Statistics from './Statistics'

const Dashboard = () => {
  return (
    <Container maxWidth={false}>
      <Box sx={{ py: 4 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              mb: 2,
              fontWeight: 'bold',
              color: 'primary.main'
            }}
          >
            Admin Dashboard
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: 'text.secondary',
              mb: 3 
            }}
          >
            Manage users, trips, and view platform statistics
          </Typography>
        </Box>

        {/* Stats Summary */}
        <Box sx={{ mb: 4 }}>
          <Statistics />
        </Box>

        {/* Main Content Grid */}
        <Grid container spacing={3}>
          {/* User Management Section */}
          <Grid item xs={12} lg={6}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3,
                height: '100%',
                backgroundColor: 'background.paper',
                border: 1,
                borderColor: 'divider'
              }}
            >
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                User Management
              </Typography>
              <UserManagement />
            </Paper>
          </Grid>

          {/* Trip Management Section */}
          <Grid item xs={12} lg={6}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3,
                height: '100%',
                backgroundColor: 'background.paper',
                border: 1,
                borderColor: 'divider'
              }}
            >
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                Trip Management
              </Typography>
              <TripManagement />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}
export default Dashboard
