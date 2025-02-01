import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { 
  Box, 
  Button, 
  Typography, 
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  FormHelperText,
  Paper
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import ImageUpload from '../common/ImageUpload'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

interface TripFormProps {
  onSubmit: (data: TripFormData) => Promise<void>
  initialData?: TripFormData
  mode?: 'create' | 'edit'
}

interface TripFormData {
  title: string
  description: string
  start_date: Date
  end_date: Date
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
  distance: number
  images?: string[]
}

const schema = yup.object().shape({
  title: yup.string().required('Title is required').min(3, 'Title must be at least 3 characters'),
  description: yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
  start_date: yup.date().required('Start date is required'),
  end_date: yup.date().required('End date is required')
    .min(yup.ref('start_date'), 'End date must be after start date'),
  difficulty: yup.string().oneOf(['easy', 'medium', 'hard', 'expert'], 'Invalid difficulty level')
    .required('Difficulty is required'),
  distance: yup.number()
    .required('Distance is required')
    .min(0, 'Distance must be positive')
    .typeError('Distance must be a number')
})

const TripForm = ({ onSubmit, initialData, mode = 'create' }: TripFormProps) => {
  const [tripImages, setTripImages] = useState<string[]>(initialData?.images || [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors }, control, setValue } = useForm<TripFormData>({
    resolver: yupResolver(schema),
    defaultValues: initialData || {
      title: '',
      description: '',
      difficulty: 'medium',
      distance: 0,
      start_date: new Date(),
      end_date: new Date()
    }
  })

  const handleImageChange = (images: string[]) => {
    setTripImages(images)
  }

  const handleFormSubmit = async (data: TripFormData) => {
    setLoading(true)
    setError(null)
    try {
      await onSubmit({
        ...data,
        images: tripImages
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save trip')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit(handleFormSubmit)}
      elevation={0}
      sx={{
        maxWidth: 800,
        mx: 'auto',
        p: 3,
        border: 1,
        borderColor: 'divider'
      }}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          mb: 3,
          color: 'text.primary',
          fontWeight: 500
        }}
      >
        {mode === 'create' ? 'Create New Trip' : 'Edit Trip'}
      </Typography>

      <TextField
        fullWidth
        label="Title"
        {...register('title')}
        error={!!errors.title}
        helperText={errors.title?.message}
        sx={{ mb: 3 }}
      />

      <TextField
        fullWidth
        label="Description"
        multiline
        rows={4}
        {...register('description')}
        error={!!errors.description}
        helperText={errors.description?.message}
        sx={{ mb: 3 }}
      />

      <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
        <FormControl fullWidth error={!!errors.difficulty}>
          <InputLabel>Difficulty</InputLabel>
          <Select
            label="Difficulty"
            {...register('difficulty')}
            defaultValue="medium"
          >
            <MenuItem value="easy">Easy</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="hard">Hard</MenuItem>
            <MenuItem value="expert">Expert</MenuItem>
          </Select>
          {errors.difficulty && (
            <FormHelperText>{errors.difficulty.message}</FormHelperText>
          )}
        </FormControl>

        <TextField
          fullWidth
          label="Distance (km)"
          type="number"
          inputProps={{ min: 0, step: 0.1 }}
          {...register('distance')}
          error={!!errors.distance}
          helperText={errors.distance?.message}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
        <DatePicker
          label="Start Date"
          onChange={(date) => setValue('start_date', date as Date)}
          sx={{ flex: 1 }}
          slotProps={{
            textField: {
              error: !!errors.start_date,
              helperText: errors.start_date?.message
            }
          }}
        />
        <DatePicker
          label="End Date"
          onChange={(date) => setValue('end_date', date as Date)}
          sx={{ flex: 1 }}
          slotProps={{
            textField: {
              error: !!errors.end_date,
              helperText: errors.end_date?.message
            }
          }}
        />
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ 
            color: 'text.primary',
            fontWeight: 500
          }}
        >
          Trip Images
        </Typography>
        <ImageUpload
          images={tripImages}
          onChange={handleImageChange}
          maxImages={10}
          maxSize={Number(import.meta.env.VITE_UPLOAD_MAX_SIZE)}
          allowedTypes={['image/jpeg', 'image/png']}
        />
      </Box>

      <Button 
        type="submit" 
        variant="contained" 
        disabled={loading}
        fullWidth
        sx={{
          py: 1.5,
          fontWeight: 500
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={20} />
            <span>Saving...</span>
          </Box>
        ) : mode === 'create' ? 'Create Trip' : 'Update Trip'}
      </Button>
    </Paper>
  )
}

export default TripForm
