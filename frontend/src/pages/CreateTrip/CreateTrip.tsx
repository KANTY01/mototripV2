import React, { useState, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Alert,
  Breadcrumbs,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  FormHelperText,
  Chip,
  Autocomplete,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { SelectChangeEvent } from '@mui/material/Select';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { tripsApi } from '../../services/api/trips';
import ImageUpload from '../../components/common/ImageUpload';
import { TripCategory, TRIP_CATEGORIES, COMMON_TAGS } from '../../types/trip';

const CreateTrip: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    startDate: null as Date | null,
    endDate: null as Date | null,
    price: '',
    capacity: '',
    category: 'adventure' as TripCategory,
    tags: [] as string[],
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageError, setImageError] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleCategoryChange = (e: SelectChangeEvent<TripCategory>) => {
    setFormData((prev) => ({
      ...prev,
      category: e.target.value as TripCategory,
    }));
  };

  const handleImageSelect = useCallback((file: File) => {
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setImageError('Image size must be less than 5MB');
      return;
    }

    setImageFile(file);
    setImageError('');
    setImagePreview(URL.createObjectURL(file));
  }, []);

  const handleImageClear = useCallback(() => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview('');
    setImageError('');
  }, [imagePreview]);

  const uploadImage = async (file: File): Promise<string> => {
    // TODO: Implement actual image upload to a storage service
    // For now, we'll simulate an upload delay and return a dummy URL
    await new Promise(resolve => setTimeout(resolve, 1000));
    return URL.createObjectURL(file);
  };

  const validateDates = (start: Date | null, end: Date | null): boolean => {
    if (!start || !end) return true;
    if (start > end) {
      setDateError('Start date cannot be after end date');
      return false;
    }
    setDateError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.startDate || !formData.endDate) {
      setError('Please select both start and end dates');
      return;
    }

    if (!validateDates(formData.startDate, formData.endDate)) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let imageUrl = '';
      if (imageFile) {
        setUploadingImage(true);
        try {
          imageUrl = await uploadImage(imageFile);
        } catch (err) {
          setImageError('Failed to upload image. Please try again.');
          setLoading(false);
          setUploadingImage(false);
          return;
        }
        setUploadingImage(false);
      }

      await tripsApi.createTrip({
        ...formData,
        price: Number(formData.price),
        capacity: Number(formData.capacity),
        startDate: formData.startDate!.toISOString(),
        endDate: formData.endDate!.toISOString(),
        status: 'pending',
        availableSpots: Number(formData.capacity),
        imageUrl,
        category: formData.category,
        tags: formData.tags.map(tag => ({ id: tag.toLowerCase(), name: tag })),
      });

      navigate('/trips');
    } catch (err) {
      setError('Failed to create trip. Please try again.');
      console.error('Error creating trip:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/" color="inherit" underline="hover">
          Home
        </Link>
        <Link component={RouterLink} to="/trips" color="inherit" underline="hover">
          Trips
        </Link>
        <Typography color="text.primary">Create Trip</Typography>
      </Breadcrumbs>

      {/* Page Header */}
      <Paper sx={{ p: 4, mb: 4, background: 'linear-gradient(135deg, #f6f8fc 0%, #e3f2fd 100%)' }}>
        <Box sx={{ maxWidth: 800, mx: 'auto', textAlign: 'center' }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Create New Trip
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Share your motorcycle adventure with fellow riders
          </Typography>
        </Box>
      </Paper>

      {/* Create Trip Form */}
      <Paper sx={{ p: { xs: 2, md: 4 } }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Trip Title"
                value={formData.title}
                onChange={handleChange('title')}
                required
                helperText="Enter a descriptive title for your trip"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={handleChange('description')}
                multiline
                rows={4}
                required
                helperText="Describe the trip, including route details and highlights"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                value={formData.location}
                onChange={handleChange('location')}
                required
                helperText="Starting point or main location of the trip"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box>
                <DatePicker
                  label="Start Date"
                  value={formData.startDate}
                  onChange={(date) => {
                    setFormData((prev) => ({ ...prev, startDate: date }));
                    validateDates(date, formData.endDate);
                  }}
                  slotProps={{
                    textField: { 
                      fullWidth: true, 
                      required: true,
                      error: Boolean(dateError),
                      helperText: dateError || 'Trip start date'
                    },
                  }}
                  disablePast
                />
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box>
                <DatePicker
                  label="End Date"
                  value={formData.endDate}
                  onChange={(date) => {
                    setFormData((prev) => ({ ...prev, endDate: date }));
                    validateDates(formData.startDate, date);
                  }}
                  slotProps={{
                    textField: { 
                      fullWidth: true, 
                      required: true,
                      error: Boolean(dateError),
                      helperText: dateError || 'Trip end date'
                    },
                  }}
                  disablePast
                />
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={formData.price}
                onChange={handleChange('price')}
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  inputProps: { min: 0, step: "0.01" }
                }}
                helperText="Price per person for the trip"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Capacity"
                type="number"
                value={formData.capacity}
                onChange={handleChange('capacity')}
                required
                inputProps={{ min: 1 }}
                helperText="Maximum number of participants"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={handleCategoryChange}
                >
                  {TRIP_CATEGORIES.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Select the type of motorcycle trip</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Autocomplete
                multiple
                id="tags"
                options={COMMON_TAGS}
                value={formData.tags}
                onChange={(_, newValue) => {
                  setFormData(prev => ({ ...prev, tags: newValue }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tags"
                    helperText="Add relevant tags to help riders find your trip"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      {...getTagProps({ index })}
                      key={option}
                    />
                  ))
                }
                freeSolo
              />
            </Grid>

            <Grid item xs={12}>
              <ImageUpload
                onImageSelect={handleImageSelect}
                onImageClear={handleImageClear}
                error={imageError}
                loading={uploadingImage}
                previewUrl={imagePreview}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/trips')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || Boolean(dateError)}
                >
                  Create Trip
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateTrip;
