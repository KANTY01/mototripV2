import { useState, useEffect } from 'react'
import { 
  Box, 
  Typography, 
  Grid, 
  Paper,
  LinearProgress, 
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Stack,
  useTheme
} from '@mui/material'
import {
  EmojiEvents as TrophyIcon,
  Info as InfoIcon,
  Lock as LockIcon,
  Stars as RewardIcon
} from '@mui/icons-material'
import { userApi, Achievement } from '../../api/users'

interface AchievementsProps {
  userId: number
}

interface AchievementCategory {
  name: string
  icon: string
  color: string
}

const categories: Record<string, AchievementCategory> = {
  trips: {
    name: 'Trips',
    icon: '🏍️',
    color: '#4CAF50'
  },
  social: {
    name: 'Social',
    icon: '👥',
    color: '#2196F3'
  },
  reviews: {
    name: 'Reviews',
    icon: '⭐',
    color: '#FFC107'
  },
  premium: {
    name: 'Premium',
    icon: '👑',
    color: '#9C27B0'
  }
}

const Achievements: React.FC<AchievementsProps> = ({ userId }) => {
  const theme = useTheme()
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAchievements = async () => {
      if (userId) {
        try {
          const response = await userApi.getUserAchievements(userId)
          setAchievements(response)
          setError(null)
        } catch (error) {
          console.error('Failed to fetch achievements:', error)
          setError('Failed to load achievements')
        } finally {
          setLoading(false)
        }
      }
    }

    fetchAchievements()
  }, [userId])

  const handleAchievementClick = (achievement: Achievement) => {
    setSelectedAchievement(achievement)
    setDialogOpen(true)
  }

  const getAchievementLevel = (progress: number) => {
    if (progress >= 100) return 'Master'
    if (progress >= 75) return 'Expert'
    if (progress >= 50) return 'Advanced'
    if (progress >= 25) return 'Intermediate'
    return 'Beginner'
  }

  const groupedAchievements = achievements.reduce((acc, achievement) => {
    const category = achievement.category || 'other'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(achievement)
    return acc
  }, {} as Record<string, Achievement[]>)

  return (
    <Box>
      <Typography 
        variant="h5" 
        gutterBottom
        sx={{ 
          fontWeight: 600,
          mb: 3
        }}
      >
        Achievements
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {Object.entries(groupedAchievements).map(([category, categoryAchievements]) => (
        <Box key={category} sx={{ mb: 4 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <Typography 
              variant="h6" 
              component="span"
              sx={{ 
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              {categories[category]?.icon || '🎯'} {categories[category]?.name || category}
            </Typography>
            <Chip 
              size="small"
              label={`${categoryAchievements.filter(a => a.progress === 100).length}/${categoryAchievements.length}`}
              color="primary"
            />
          </Stack>

          <Grid container spacing={2}>
            {categoryAchievements.map(achievement => (
              <Grid item xs={12} sm={6} md={4} key={achievement.id}>
                <Paper
                  elevation={0}
                  sx={{
                    height: '100%',
                    p: 2,
                    position: 'relative',
                    opacity: achievement.progress === 0 ? 0.7 : 1,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[4]
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: categories[category]?.color || theme.palette.primary.main,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2
                      }}
                    >
                      {achievement.progress === 0 ? (
                        <LockIcon sx={{ color: 'white' }} />
                      ) : (
                        <TrophyIcon sx={{ color: 'white' }} />
                      )}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 500,
                          mb: 0.5
                        }}
                      >
                        {achievement.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Level: {getAchievementLevel(achievement.progress)}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => handleAchievementClick(achievement)}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'action.hover'
                        }
                      }}
                    >
                      <InfoIcon />
                    </IconButton>
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" sx={{ flex: 1 }}>
                        Progress
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {achievement.progress}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={achievement.progress}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: theme.palette.grey[200],
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: categories[category]?.color || theme.palette.primary.main,
                          borderRadius: 3
                        }
                      }}
                    />
                  </Box>

                  {achievement.reward && (
                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                      <RewardIcon sx={{ 
                        fontSize: 16, 
                        mr: 0.5, 
                        color: theme.palette.warning.main 
                      }} />
                      <Typography variant="caption" color="text.secondary">
                        {achievement.reward}
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}

      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        PaperProps={{
          elevation: 0,
          sx: {
            border: 1,
            borderColor: 'divider',
            borderRadius: 1
          }
        }}
      >
        {selectedAchievement && (
          <>
            <DialogTitle>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {selectedAchievement.name}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Typography paragraph>
                {selectedAchievement.description}
              </Typography>
              {selectedAchievement.unlockDate && (
                <Typography variant="body2" color="text.secondary">
                  Unlocked: {new Date(selectedAchievement.unlockDate).toLocaleDateString()}
                </Typography>
              )}
              {selectedAchievement.reward && (
                <Paper
                  elevation={0}
                  sx={{
                    mt: 2,
                    p: 2,
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1
                  }}
                >
                  <Typography variant="subtitle2" gutterBottom sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <RewardIcon sx={{ color: theme.palette.warning.main }} />
                    Reward
                  </Typography>
                  <Typography variant="body2">
                    {selectedAchievement.reward}
                  </Typography>
                </Paper>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  )
}

export default Achievements
