import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@mui/material'
import { socialApi } from '../../api/social'
import { RootState } from '../../store/store'

interface FollowButtonProps {
  userId: number
}

const FollowButton = ({ userId }: FollowButtonProps) => {
  const dispatch = useDispatch()
  const [isFollowing, setIsFollowing] = useState(false)
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id)

  useEffect(() => {
    const fetchFollowingStatus = async () => {
      try {
        const followers = await socialApi.getFollowers(userId)
        const isCurrentlyFollowing = followers.some((follower: any) => follower.id === currentUserId)
        setIsFollowing(isCurrentlyFollowing)
      } catch (error) {
        console.error('Failed to fetch following status:', error)
      }
    }

    if (currentUserId && userId) {
      fetchFollowingStatus()
    }
  }, [currentUserId, userId, dispatch])

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await socialApi.unfollowUser(userId)
        setIsFollowing(false)
      } else {
        await socialApi.followUser(userId)
        setIsFollowing(true)
      }
    } catch (error) {
      console.error('Follow operation failed:', error)
    }
  }

  if (currentUserId === userId) return null

  return (
    <Button
      variant={isFollowing ? 'outlined' : 'contained'}
      onClick={handleFollow}
    >
      {isFollowing ? 'Unfollow' : 'Follow'}
    </Button>
  )
}

export default FollowButton
