import { Avatar, Box, Typography, Grid, Chip, Paper, useTheme } from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike'
import StarIcon from '@mui/icons-material/Star'
import GroupIcon from '@mui/icons-material/Group'

const ProfileHeader = () => {
  const { profile } = useSelector((state: RootState) => state.user)
  const theme = useTheme()

  if (!profile) return null

  return (
    <Box>
      <Paper
        elevation={3}
        sx={{
          mb: 4,
          background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
          borderRadius: 2,
          position: 'relative',
          overflow: 'hidden',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'scale(1.01)'
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 4,
            color: 'white'
          }}
        >
          <Avatar
            src={profile.avatar}
            sx={{
              width: { xs: 100, sm: 120, md: 140 },
              height: { xs: 100, sm: 120, md: 140 },
              mr: 4,
              border: '4px solid rgba(255, 255, 255, 0.8)',
              boxShadow: theme.shadows[4],
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                border: '4px solid white'
              }
            }}
          />
          <Box>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 600, 
                mb: 2,
                textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' }
              }}
            >
              {profile.username}
            </Typography>
            <Chip
              icon={<StarIcon sx={{ color: 'white !important' }} />}
              label={`${profile.experience_level} Rider`}
              sx={{
                mr: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                '& .MuiChip-icon': {
                  color: 'white'
                },
                transition: 'transform 0.2s ease, background-color 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.3)'
                }
              }}
            />
          </Box>
        </Box>
      </Paper>
      
      <Grid container spacing={3}>
        {[
          { icon: DirectionsBikeIcon, count: profile.trip_count || 0, label: 'Trips' },
          { icon: GroupIcon, count: profile.follower_count || 0, label: 'Followers' },
          { icon: StarIcon, count: profile.review_count || 0, label: 'Reviews' }
        ].map((item, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Paper
              sx={{
                p: 3,
                textAlign: 'center',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[4]
                }
              }}
            >
              <Box
                sx={{
                  backgroundColor: 'primary.light',
                  borderRadius: '50%',
                  width: 60,
                  height: 60,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  mb: 2
                }}
              >
                <item.icon
                  sx={{
                    fontSize: 30,
                    color: 'primary.main'
                  }}
                />
              </Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  mb: 1,
                  fontWeight: 600,
                  color: 'primary.main'
                }}
              >
                {item.count}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'text.secondary',
                  fontWeight: 500
                }}
              >
                {item.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default ProfileHeader
