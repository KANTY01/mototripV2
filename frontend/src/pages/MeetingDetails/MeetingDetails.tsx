import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  Avatar,
  Chip,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  TextField,
} from '@mui/material';
import {
  LocationOn,
  AccessTime,
  Group,
  Edit,
  Delete,
  Person,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { Meeting, MeetingStatus } from '../../types/types';

interface MeetingDetailsProps {
  isCreate?: boolean;
  isEdit?: boolean;
}

// TODO: Replace with actual API call
const MOCK_MEETING: Meeting = {
  id: 1,
  title: 'Weekend Ride to Mountains',
  description: 'Join us for an exciting mountain ride this weekend! We\'ll explore scenic routes and stop at interesting locations along the way. Suitable for all skill levels.',
  location: 'Mountain Trail, Colorado',
  date: '2025-01-20',
  time: '09:00',
  imageUrl: '/placeholder-meeting.jpg',
  maxParticipants: 15,
  currentParticipants: 8,
  status: MeetingStatus.UPCOMING,
  organizer: {
    id: 1,
    username: 'johnrider',
    email: 'john@example.com',
    role: 'user',
    profile: {
      id: 1,
      userId: 1,
      firstName: 'John',
      lastName: 'Doe',
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01',
    },
  },
  createdAt: '2025-01-01',
  updatedAt: '2025-01-01',
};

const MeetingDetails: React.FC<MeetingDetailsProps> = ({ isCreate = false, isEdit = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
    maxParticipants: '',
  });

  useEffect(() => {
    if (!isCreate && id) {
      // TODO: Fetch meeting data
      setFormData({
        title: MOCK_MEETING.title,
        description: MOCK_MEETING.description,
        location: MOCK_MEETING.location,
        date: MOCK_MEETING.date,
        time: MOCK_MEETING.time,
        maxParticipants: MOCK_MEETING.maxParticipants?.toString() || '',
      });
    }
  }, [isCreate, id]);

  // TODO: Replace with actual auth check and API calls
  const isAuthenticated = true;
  const currentUserId = 1;
  const isOrganizer = currentUserId === MOCK_MEETING.organizer.id;
  const hasJoined = true;

  const formatDate = (date: string, time: string) => {
    const dateObj = new Date(`${date}T${time}`);
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: MeetingStatus): "primary" | "success" | "error" | "default" => {
    switch (status) {
      case MeetingStatus.UPCOMING:
        return 'primary';
      case MeetingStatus.IN_PROGRESS:
        return 'success';
      case MeetingStatus.COMPLETED:
        return 'default';
      case MeetingStatus.CANCELLED:
        return 'error';
      default:
        return 'default';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement create/update functionality
    console.log('Form data:', formData);
    navigate('/');
  };

  const handleEdit = () => {
    navigate(`/meetings/${id}/edit`);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    // TODO: Implement delete functionality
    console.log('Deleting meeting:', id);
    setIsDeleteDialogOpen(false);
    navigate('/');
  };

  const handleJoinLeave = () => {
    // TODO: Implement join/leave functionality
    console.log(hasJoined ? 'Leaving meeting' : 'Joining meeting:', id);
  };

  if (isLoading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  if (isCreate || isEdit) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            {isCreate ? 'Create New Meeting' : 'Edit Meeting'}
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Max Participants"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="time"
                  label="Time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button onClick={() => navigate(-1)}>Cancel</Button>
                  <Button type="submit" variant="contained" color="primary">
                    {isCreate ? 'Create Meeting' : 'Save Changes'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ overflow: 'hidden' }}>
        <Box sx={{ position: 'relative', width: '100%', height: 300 }}>
          <Box
            component="img"
            src={MOCK_MEETING.imageUrl || '/placeholder-meeting.jpg'}
            alt={MOCK_MEETING.title}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          {isOrganizer && (
            <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 1 }}>
              <IconButton
                onClick={handleEdit}
                sx={{ bgcolor: 'background.paper' }}
              >
                <Edit />
              </IconButton>
              <IconButton
                onClick={handleDelete}
                sx={{ bgcolor: 'background.paper' }}
                color="error"
              >
                <Delete />
              </IconButton>
            </Box>
          )}
        </Box>

        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Typography variant="h4" component="h1">
                  {MOCK_MEETING.title}
                </Typography>
                <Chip
                  label={MOCK_MEETING.status.toLowerCase()}
                  color={getStatusColor(MOCK_MEETING.status)}
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body1" paragraph>
                {MOCK_MEETING.description}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn color="action" />
                  <Typography>{MOCK_MEETING.location}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTime color="action" />
                  <Typography>
                    {formatDate(MOCK_MEETING.date, MOCK_MEETING.time)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Group color="action" />
                  <Typography>
                    {MOCK_MEETING.currentParticipants}
                    {MOCK_MEETING.maxParticipants && `/${MOCK_MEETING.maxParticipants}`} participants
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={MOCK_MEETING.organizer.profile.avatarUrl}>
                  <Person />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1">
                    Organized by {MOCK_MEETING.organizer.profile.firstName} {MOCK_MEETING.organizer.profile.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    @{MOCK_MEETING.organizer.username}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {isAuthenticated && !isOrganizer && (
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color={hasJoined ? 'error' : 'primary'}
                  onClick={handleJoinLeave}
                  fullWidth={isMobile}
                >
                  {hasJoined ? 'Leave Meeting' : 'Join Meeting'}
                </Button>
              </Grid>
            )}
          </Grid>
        </Box>
      </Paper>

      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Meeting</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this meeting? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MeetingDetails;