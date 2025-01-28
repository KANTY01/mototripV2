import React, { useEffect, useState } from 'react';
import { 
    Box, 
    Typography, 
    List, 
    ListItem, 
    ListItemText, 
    Container,
    Paper,
    ListItemButton,
    ListItemIcon
} from '@mui/material';
import { api } from '../../services/api';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

const Meetings: React.FC = () => {
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMeetings = async () => {
            try {
                const response = await api.get('/api/meetings');
                setMeetings(response.data);
            } catch (err) {
                setError('Failed to load meetings');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMeetings();
    }, []);

    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Upcoming Meetings
                </Typography>
                <Paper elevation={3}>
                    {loading ? (
                        <Box display="flex" justifyContent="center" p={4}>
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Box p={2}>
                            <Alert severity="error">{error}</Alert>
                        </Box>
                    ) : (
                        <List>
                            {meetings.map((meeting: any) => (
    
                            <ListItem key={meeting.id} disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <DirectionsBikeIcon color="primary" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={meeting.title}
                                            secondary={`${new Date(meeting.meetingDate).toLocaleString()} - ${meeting.location}`}
                                            primaryTypographyProps={{ variant: 'h6' }}
                                            secondaryTypographyProps={{ variant: 'body2' }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    )}

                </Paper>
            </Box>
        </Container>
    );
};

export default Meetings;