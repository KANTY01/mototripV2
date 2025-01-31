import { Box, Typography, Paper, Grid, useTheme } from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler'
import TerrainIcon from '@mui/icons-material/Terrain'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import PersonIcon from '@mui/icons-material/Person'

const ProfileDetails = () => {
  const { profile } = useSelector((state: RootState) => state.user)
  const theme = useTheme()

  if (!profile) return null

  const detailItems = [
    {
      icon: PersonIcon,
      label: 'Username',
      value: profile.username
    },
    {
      icon: EmojiEventsIcon,
      label: 'Experience Level',
      value: profile.experience_level
    },
    {
      icon: TerrainIcon,
      label: 'Preferred Routes',
      value: Array.isArray(profile.preferred_routes) 
        ? profile.preferred_routes.join(', ') 
        : (profile.preferred_routes ? JSON.parse(profile.preferred_routes).join(', ') : '')
    },
    ...(profile.motorcycle_details ? [
      {
        icon: TwoWheelerIcon,
        label: 'Motorcycle',
        value: `${profile.motorcycle_details.make} ${profile.motorcycle_details.model} (${profile.motorcycle_details.year})`
      }
    ] : [])
  ]

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        mb: 4,
        borderRadius: 2,
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
                borderRadius: 2,
                backgroundColor: 'background.default',
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
                    fontSize: 24
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
