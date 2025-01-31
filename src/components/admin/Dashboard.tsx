import { Box, Typography } from '@mui/material'
import UserManagement from './UserManagement'
import TripManagement from './TripManagement'
import Statistics from './Statistics'

const Dashboard = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
        <Box>
          <Typography variant="h6" gutterBottom>
            User Management
          </Typography>
          <UserManagement />
        </Box>
        
        <Box>
          <Typography variant="h6" gutterBottom>
            Trip Management
          </Typography>
          <TripManagement />
        </Box>
        
        <Box>
          <Typography variant="h6" gutterBottom>
            Statistics
          </Typography>
          <Statistics />
        </Box>
      </Box>
    </Box>
  )
}

export default Dashboard
