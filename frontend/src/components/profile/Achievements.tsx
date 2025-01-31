import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { Box, Typography, Chip } from '@mui/material'
import { userApi } from '../../api/users'

interface Achievement {
  id: number
  name: string
  description: string
  achieved_at: string
}

const Achievements = () => {
  const { profile } = useSelector((state: RootState) => state.user)
  const [achievements, setAchievements] = useState<Achievement[]>([])

  useEffect(() => {
    const fetchAchievements = async () => {
      if (profile) {
        try {
          const response = await userApi.getUserAchievements(profile.id)
          setAchievements(response)
        } catch (error) {
          console.error('Failed to fetch achievements:', error)
        }
      }
    }

    fetchAchievements()
  }, [profile])

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Achievements
      </Typography>
      {achievements.length > 0 ? (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {achievements.map(achievement => (
            <Chip
              key={achievement.id}
              label={achievement.name}
              title={achievement.description}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
      ) : (
        <Typography>No achievements yet.</Typography>
      )}
    </Box>
  )
}

export default Achievements
