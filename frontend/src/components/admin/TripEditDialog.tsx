import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Box,
  Alert,
  CircularProgress,
  FormHelperText
} from '@mui/material';
import { adminApi, TripUpdateData } from '../../api/admin';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

interface Trip {
  id: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'moderate' | 'hard';
  distance: number;
  start_date: string;
  end_date: string;
  duration: string;
  isPremium: boolean;
  status: 'active' | 'draft' | 'archived';
  terrain?: string;
  startLocation?: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

interface StartLocation {
  latitude: number;
  longitude: number;
  address: string;
}

export interface EditTripData {
  title: string;
  description: string;
  difficulty: 'easy' | 'moderate' | 'hard';
  distance: number;
  start_date: string;
  end_date: string;
  duration: string;
  isPremium: boolean;
  status: 'active' | 'draft' | 'archived';
  terrain?: string;
  startLocation?: StartLocation;
}

interface TripEditDialogProps {
  open: boolean;
  onClose: () => void;
  trip: Trip | null;
  onSave: (data: EditTripData) => Promise<void>;
}

const schema = yup.object().shape({
  title: yup.string().required('Title is required').min(3, 'Title must be at least 3 characters'),
  description: yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
  difficulty: yup.string().required('Difficulty is required').oneOf(['easy', 'moderate', 'hard']),
  distance: yup.number().required('Distance is required').positive('Distance must be positive'),
  start_date: yup.string().required('Start date is required'),
  end_date: yup.string().required('End date is required'),
  duration: yup.string().required('Duration is required'),
  status: yup.string().required('Status is required').oneOf(['active', 'draft', 'archived']),
  isPremium: yup.boolean().required(),
  terrain: yup.string().optional(),
  startLocation: yup.object({
    latitude: yup.number().min(-90).max(90),
    longitude: yup.number().min(-180).max(180),
    address: yup.string()
  }).optional().default(undefined)
}) as yup.ObjectSchema<EditTripData>;

const TripEditDialog: React.FC<TripEditDialogProps> = ({
  open,
  onClose,
  trip,
  onSave
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<EditTripData>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      difficulty: 'moderate',
      distance: 0,
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0],
      duration: '',
      isPremium: false,
      status: 'draft',
      terrain: '',
      startLocation: {
        latitude: 0,
        longitude: 0,
        address: ''
      }
    }
  });

  useEffect(() => {
    if (trip) {
      reset({
        title: trip.title,
        description: trip.description,
        difficulty: trip.difficulty,
        distance: trip.distance,
        start_date: trip.start_date?.split('T')[0] || new Date().toISOString().split('T')[0],
        end_date: trip.end_date?.split('T')[0] || new Date().toISOString().split('T')[0],
        duration: trip.duration,
        isPremium: trip.isPremium,
        status: trip.status,
        terrain: trip.terrain,
        startLocation: trip.startLocation
      });
    } else {
      reset({
        title: '',
        description: '',
        difficulty: 'moderate',
        distance: 0,
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
        duration: '',
        isPremium: false,
        status: 'draft',
        terrain: '',
        startLocation: {
          latitude: 0,
          longitude: 0,
          address: ''
        }
      });
    }
  }, [trip, reset]);

  const onSubmit = async (data: EditTripData) => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === 'startLocation' && typeof value === 'object') {
            // Flatten startLocation object into individual fields
            const location = value as StartLocation;
            if (location.latitude) {
              formData.append('startLatitude', location.latitude.toString());
            }
            if (location.longitude) {
              formData.append('startLongitude', location.longitude.toString());
            }
            if (location.address) {
              formData.append('startAddress', location.address);
            }
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      if (trip) {
        await adminApi.updateTrip(trip.id, formData);
      } else {
        await adminApi.createTrip(formData);
      }

      await onSave(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save trip');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{trip ? 'Edit Trip' : 'Create New Trip'}</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Title"
                    error={!!errors.title}
                    helperText={errors.title?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Description"
                    multiline
                    rows={4}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="difficulty"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.difficulty}>
                    <InputLabel>Difficulty</InputLabel>
                    <Select {...field} label="Difficulty">
                      <MenuItem value="easy">Easy</MenuItem>
                      <MenuItem value="moderate">Moderate</MenuItem>
                      <MenuItem value="hard">Hard</MenuItem>
                    </Select>
                    {errors.difficulty && (
                      <FormHelperText>{errors.difficulty.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="distance"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="Distance (km)"
                    error={!!errors.distance}
                    helperText={errors.distance?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="start_date"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="date"
                    label="Start Date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={!!errors.start_date}
                    helperText={errors.start_date?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="end_date"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="date"
                    label="End Date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={!!errors.end_date}
                    helperText={errors.end_date?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="duration"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Duration"
                    placeholder="e.g., 2 days"
                    error={!!errors.duration}
                    helperText={errors.duration?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.status}>
                    <InputLabel>Status</InputLabel>
                    <Select {...field} label="Status">
                      <MenuItem value="draft">Draft</MenuItem>
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="archived">Archived</MenuItem>
                    </Select>
                    {errors.status && (
                      <FormHelperText>{errors.status.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="isPremium"
                control={control}
                render={({ field: { value, onChange, ...field } }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={value}
                        onChange={(e) => onChange(e.target.checked)}
                        {...field}
                      />
                    }
                    label="Premium Trip"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="terrain"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Terrain"
                    error={!!errors.terrain}
                    helperText={errors.terrain?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="startLocation.address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Start Location Address"
                    error={!!errors.startLocation?.address}
                    helperText={errors.startLocation?.address?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="startLocation.latitude"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="Latitude"
                    error={!!errors.startLocation?.latitude}
                    helperText={errors.startLocation?.latitude?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="startLocation.longitude"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="Longitude"
                    error={!!errors.startLocation?.longitude}
                    helperText={errors.startLocation?.longitude?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : trip ? (
              'Save Changes'
            ) : (
              'Create Trip'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TripEditDialog;