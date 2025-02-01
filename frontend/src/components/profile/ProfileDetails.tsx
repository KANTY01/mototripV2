import { Box, Typography, Paper, Grid, useTheme } from '@mui/material'
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler'
import TerrainIcon from '@mui/icons-material/Terrain'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import PersonIcon from '@mui/icons-material/Person'
import { User } from '../../types'

interface ProfileDetailsProps {
  user: User;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ user }) => {
  const theme = useTheme()

  const detailItems = [
    {
      icon: PersonIcon,
      label: 'Username',
      value: user.username
    },
    {
      icon: EmojiEventsIcon,
      label: 'Experience Level',
      value: user.experience_level || 'Beginner'
    },
    {
      icon: TerrainIcon,
      label: 'Preferred Routes',
      value: Array.isArray(user.preferred_routes) 
        ? user.preferred_routes.join(', ') 
        : 'Not specified'
    },
    ...(user.motorcycle_details ? [
      {
        icon: TwoWheelerIcon,
        label: 'Motorcycle',
        value: `${user.motorcycle_details.make} ${user.motorcycle_details.model} (${user.motorcycle_details.year})`
      }
    ] : [])
  ]

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 1,
        border: 1,
        borderColor: 'divider',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4]
        }
      }}
    >
      <Typography 
        variant="h5" 
        gutterBottom
        sx={{
          fontWeight: 600,
          color: 'primary.main',
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        Profile Details
      </Typography>

      <Grid container spacing={3}>
        {detailItems.map((item, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 2,
                p: 2,
                borderRadius: 1,
                backgroundColor: 'background.paper',
                transition: 'transform 0.2s, background-color 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  backgroundColor: 'action.hover'
                }
              }}
            >
              <Box
                sx={{
                  backgroundColor: 'primary.light',
                  borderRadius: '50%',
                  p: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <item.icon 
                  sx={{ 
                    color: 'primary.main',
                    fontSize: '2rem'
                  }} 
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary',
                    mb: 0.5,
                    fontWeight: 500
                  }}
                >
                  {item.label}
                </Typography>
                <Typography 
                  variant="body1"
                  sx={{
                    fontWeight: 500,
                    color: 'text.primary',
                    lineHeight: 1.5
                  }}
                >
                  {item.value}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  )
}

export default ProfileDetails
