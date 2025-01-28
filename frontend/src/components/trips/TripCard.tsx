import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  Rating,
  CardActions,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DateRangeIcon from '@mui/icons-material/DateRange';
import GroupIcon from '@mui/icons-material/Group';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { TripResponse } from '../../services/api/trips';
import { TRIP_CATEGORIES } from '../../types/trip';

interface TripCardProps {
  trip: TripResponse;
}

const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  const navigate = useNavigate();

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'warning',
      active: 'success',
      completed: 'info',
      cancelled: 'error',
    } as const;
    return colors[status as keyof typeof colors] || 'default';
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: 3,
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={trip.imageUrl || '/motorcycle-bg.jpg'}
        alt={trip.title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            {trip.title}
          </Typography>
          <Chip
            label={trip.status.toUpperCase()}
            color={getStatusColor(trip.status)}
            size="small"
          />
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {trip.description}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOnIcon color="action" fontSize="small" />
            <Typography variant="body2">{trip.location}</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DateRangeIcon color="action" fontSize="small" />
            <Typography variant="body2">
              {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <GroupIcon color="action" fontSize="small" />
            <Typography variant="body2">
              {trip.availableSpots} spots available / {trip.capacity} total
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MonetizationOnIcon color="action" fontSize="small" />
            <Typography variant="body2">${trip.price}</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label={TRIP_CATEGORIES.find(c => c.value === trip.category)?.label || trip.category}
              size="small"
              color="primary"
              variant="outlined"
            />
            {trip.tags.slice(0, 3).map((tag) => (
              <Chip
                key={tag.id}
                label={tag.name}
                size="small"
                variant="outlined"
              />
            ))}
            {trip.tags.length > 3 && (
              <Typography variant="caption" color="text.secondary">
                +{trip.tags.length - 3} more
              </Typography>
            )}
          </Box>

          {trip.rating !== undefined && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Rating value={trip.rating} readOnly size="small" precision={0.5} />
              <Typography variant="body2">({trip.rating})</Typography>
            </Box>
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={() => navigate(`/trips/${trip.id}`)}
          disabled={trip.status === 'cancelled'}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default TripCard;
