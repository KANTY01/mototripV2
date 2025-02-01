import { Avatar, Box, Typography, Grid, Chip, Paper, useTheme } from '@mui/material'
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike'
import StarIcon from '@mui/icons-material/Star'
import GroupIcon from '@mui/icons-material/Group'
import { User } from '../../types'
import { lighten } from '@mui/material/styles';

interface ProfileHeaderProps {
  user: User;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  const theme = useTheme()

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          mb: 4,
          backgroundColor: (theme) => theme.palette.primary.main,
          color: (theme) => theme.palette.getContrastText(theme.palette.primary.main),
          borderRadius: 1,
          position: 'relative',
          overflow: 'hidden',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'scale(1.01)'
          },
          border: 1,
          borderColor: (theme) => lighten(theme.palette.primary.main, 0.5)
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 3,
            color: 'inherit'
          }}
        >
          <Avatar
            src={user.avatar}
            sx={{
              width: { xs: 80, sm: 100, md: 120 },
              height: { xs: 80, sm: 100, md: 120 },
              mr: 3,
              border: '4px solid',
              borderColor: (theme) => lighten(theme.palette.primary.main, 0.5),
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
                mt: 0,
                mb: 1,
                textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                fontSize: { xs: '1.6rem', sm: '1.8rem', md: '2rem' }
              }}
            >
              {user.username}
            </Typography>
            <Chip
              icon={<StarIcon />}
              label={`${user.experience_level || 'Beginner'} Rider`}
              sx={{
                mr: 1,
                backgroundColor: (theme) => lighten(theme.palette.primary.main, 0.2),
                color: 'inherit',
                iconColor: 'inherit',
                '&:hover': {
                  backgroundColor: (theme) => lighten(theme.palette.primary.main, 0.3)
                }
              }}
            />
          </Box>
        </Box>
      </Paper>
      
      <Grid container spacing={3}>
        {[
          { icon: DirectionsBikeIcon, count: user.stats?.total_trips || 0, label: 'Trips' },
          { icon: GroupIcon, count: user.stats?.followers_count || 0, label: 'Followers' },
          { icon: StarIcon, count: user.stats?.total_reviews || 0, label: 'Reviews' }
        ].map((item, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                textAlign: 'center',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[4]
                },
                border: 1,
                borderColor: 'divider',
                borderRadius: 1
              }}
            >
              <Box
                sx={{
                  backgroundColor: 'primary.light',
                  borderRadius: '50%',
                  width: 56,
                  height: 56,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  mb: 2,
                  flexShrink: 0
                }}
              >
                <item.icon
                  sx={{
                    fontSize: '2rem',
                    color: 'primary.main'
                  }}
                />
              </Box>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 1,
                  fontWeight: 600,
                  color: 'text.primary'
                }}
              >
                {item.count}
              </Typography>
              <Typography 
                variant="body2" 
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
