import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';
import { socialApi } from '../../api/social';
import { RootState } from '../../store/store';

interface FollowButtonProps {
  userId: number;
}

const FollowButton = ({ userId }: FollowButtonProps) => {
  const dispatch = useDispatch();
  const [isFollowing, setIsFollowing] = useState(false);
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id);

  useEffect(() => {
    const fetchFollowingStatus = async () => {
      try {
        const followers = await socialApi.getFollowers(userId);
        const isCurrentlyFollowing = followers.some((follower: any) => follower.id === currentUserId);
        setIsFollowing(isCurrentlyFollowing);
      } catch (error) {
        console.error('Failed to fetch following status:', error);
      }
    };

    if (currentUserId && userId) {
      fetchFollowingStatus();
    }
  }, [currentUserId, userId, dispatch]);

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await socialApi.unfollowUser(userId);
        setIsFollowing(false);
      } else {
        await socialApi.followUser(userId);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Follow operation failed:', error);
    }
  };

  const theme = useTheme();

  const StyledButton = styled(Button)({
    '&.MuiButton-contained': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
    },
    '&.MuiButton-outlined': {
      borderColor: theme.palette.secondary.main,
      color: theme.palette.secondary.main,
      '&:hover': {
        backgroundColor: theme.palette.secondary.light,
      },
    },
  });

  return !currentUserId || Number(currentUserId) === userId ? null : (
    <StyledButton
      variant={isFollowing ? 'outlined' : 'contained'}
      onClick={handleFollow}
    >
      {isFollowing ? 'Unfollow' : 'Follow'}
    </StyledButton>
  );
};

export default FollowButton;
