import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Tab,
  Tabs,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Divider
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import ProfileHeader from './ProfileHeader';
import ProfileDetails from './ProfileDetails';
import Achievements from './Achievements';
import SubscriptionStatus from './SubscriptionStatus';
import ProfileEdit from './ProfileEdit';
import UserTripList from '../trips/UserTripList';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { userApi } from '../../api/users';
import type { ProfileUpdate } from '../../api/users';
import { User, Trip } from '../../types';
import FollowButton from './FollowButton';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface ProfileHeaderProps {
  user: User;
}

interface ProfileDetailsProps {
  user: User;
}

interface ProfileEditProps {
  initialData: User;
  onSave: (updatedData: Partial<User>) => Promise<void>;
  onCancel: () => void;
}

interface AchievementsProps {
  userId: number;
}

interface FollowButtonProps {
  userId: number;
}

const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const UserProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.auth.user);
  const [profileData, setProfileData] = useState<User | null>(null);
  const [userTrips, setUserTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const isOwnProfile = currentUser?.id ? Number(currentUser.id) === Number(userId) : false;

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true);
        const [userData, tripsData] = await Promise.all([
          userApi.getPublicProfile(Number(userId)),
          userApi.getUserTrips(Number(userId))
        ]);
        setProfileData(userData as User);
        setUserTrips(tripsData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadProfileData();
    }
  }, [userId]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  const handleEditSave = async (updatedData: ProfileUpdate) => {
    try {
      const response = await userApi.updateProfile(updatedData);
      if (profileData) {
        // Update state with response data, keeping existing fields if not in response
        setProfileData({
          ...profileData,
          ...response
        });
      }
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !profileData) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Profile not found'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, position: 'relative' }}>
            <ProfileHeader user={profileData} />
            {!isOwnProfile && <FollowButton userId={Number(userId)} />}
            {isOwnProfile && (
              <Button
                startIcon={<EditIcon />}
                onClick={handleEditClick}
                sx={{ position: 'absolute', top: 16, right: 16 }}
              >
                Edit Profile
              </Button>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="Profile" />
              <Tab label="Trips" />
              <Tab label="Achievements" />
              {isOwnProfile && <Tab label="Settings" />}
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              {isEditing ? (
                <ProfileEdit
                  initialData={profileData}
                  onSave={handleEditSave}
                  onCancel={handleEditCancel}
                />
              ) : (
                <ProfileDetails user={profileData} />
              )}
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <UserTripList trips={userTrips} />
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Achievements userId={Number(userId)} />
            </TabPanel>

            {isOwnProfile && (
              <TabPanel value={tabValue} index={3}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <SubscriptionStatus />
                  </Grid>
                </Grid>
              </TabPanel>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserProfilePage;