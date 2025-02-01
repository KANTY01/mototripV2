import React from 'react';
import { useParams } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  DirectionsBike,
  LocationOn,
  Timer,
  Route,
  LocalGasStation,
  Terrain,
  Hotel
} from '@mui/icons-material';
import { useAppSelector } from '../../store/hooks';
import { tripApi } from '../../api/trips';
import { PremiumContent as PremiumContentType } from '../../types';

const PremiumContent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAppSelector(state => state.auth);
  const [premiumData, setPremiumData] = React.useState<PremiumContentType | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchPremiumContent = async () => {
      try {
        if (!id) throw new Error('Trip ID is required');
        const data = await tripApi.getPremiumContent(parseInt(id));
        setPremiumData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load premium content');
      } finally {
        setLoading(false);
      }
    };

    fetchPremiumContent();
  }, [id]);

  if (!user?.role || user.role !== 'premium') {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Premium Content
        </Typography>
        <Typography variant="body1" color="text.secondary">
          This content is only available to premium members. Please upgrade your subscription to access.
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography>Loading premium content...</Typography>
      </Box>
    );
  }

  if (error || !premiumData) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="error">{error || 'Content not found'}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {premiumData.title}
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="body1" paragraph>
          {premiumData.description}
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Route Details
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Route />
                    </ListItemIcon>
                    <ListItemText primary="Distance" secondary={premiumData.routeDetails.distance} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Timer />
                    </ListItemIcon>
                    <ListItemText primary="Duration" secondary={premiumData.routeDetails.duration} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Terrain />
                    </ListItemIcon>
                    <ListItemText primary="Terrain" secondary={premiumData.routeDetails.terrain} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LocalGasStation />
                    </ListItemIcon>
                    <ListItemText primary="Fuel Stops" secondary={premiumData.routeDetails.fuelStops} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Hotel />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Accommodation" 
                      secondary={premiumData.routeDetails.accommodation.join(', ')} 
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Expert Tips
                </Typography>
                <List>
                  {premiumData.expertTips.map((tip: string, index: number) => (
                    <ListItem key={index}>
                      <ListItemText primary={tip} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h6" gutterBottom>
        Premium Gallery
      </Typography>
      <Grid container spacing={2}>
        {premiumData.premiumImages.map((image: string, index: number) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={image}
                alt={`Premium route image ${index + 1}`}
                sx={{ objectFit: 'cover' }}
              />
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        Waypoints
      </Typography>
      {premiumData.waypoints.map((waypoint: PremiumContentType['waypoints'][0], index: number) => (
        <Paper key={index} sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LocationOn sx={{ mr: 1 }} />
            <Typography variant="h6">
              {waypoint.name}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {waypoint.description}
          </Typography>
          <Chip 
            icon={<DirectionsBike />}
            label={`${waypoint.coordinates[0]}, ${waypoint.coordinates[1]}`}
            size="small"
            sx={{ mt: 1, mr: 1 }}
          />
          {waypoint.pointOfInterest && <Chip 
            icon={<LocationOn />}
            label={waypoint.pointOfInterest}
            size="small"
            sx={{ mt: 1 }}
          />
          }
        </Paper>
      ))}
      
      {premiumData.additionalFeatures && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Additional Information
          </Typography>
          {premiumData.additionalFeatures.seasonalNotes && (
            <Typography variant="body2" paragraph>
              <strong>Seasonal Notes:</strong> {premiumData.additionalFeatures.seasonalNotes}
            </Typography>
          )}
          {premiumData.additionalFeatures.difficultyNotes && (
            <Typography variant="body2" paragraph>
              <strong>Difficulty Notes:</strong> {premiumData.additionalFeatures.difficultyNotes}
            </Typography>
          )}
          {premiumData.additionalFeatures.equipmentRecommendations && (
            <>
              <Typography variant="body2" gutterBottom>
                <strong>Recommended Equipment:</strong>
              </Typography>
              <List>
                {premiumData.additionalFeatures.equipmentRecommendations.map((item: string, index: number) => (
                  <ListItem key={index}>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default PremiumContent;
