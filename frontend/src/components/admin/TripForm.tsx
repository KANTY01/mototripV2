import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Alert
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { Trip } from '../../types'
import ImageUpload from '../common/ImageUpload'

interface TripFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (tripData: any) => Promise<void>
  initialData?: Trip
  mode: 'create' | 'edit'
}

const defaultFormData = {
  title: '',
  description: '',
  difficulty: 'EASY',
  distance: 0,
  start_date: new Date(),
  end_date: new Date(),
  images: [] as string[],
  is_premium: false
}

const TripForm = ({ open, onClose, onSubmit, initialData, mode }: TripFormProps) => {
  const [formData, setFormData] = useState(defaultFormData)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        difficulty: initialData.difficulty,
        distance: initialData.distance,
        start_date: new Date(initialData.start_date),
        end_date: new Date(initialData.end_date),
        images: initialData.images || [],
        is_premium: initialData.is_premium
      })
    } else {
      setFormData(defaultFormData)
    }
  }, [initialData])

  const handleChange = (field: string) => (event: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }))
  }

  const handleDateChange = (field: 'start_date' | 'end_date') => (date: Date | null) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        [field]: date
      }))
    }
  }

  const handleImagesChange = (newImages: string[]) => {
    setFormData(prev => ({
      ...prev,
      images: newImages
    }))
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Validation
      if (!formData.title.trim()) {
        throw new Error('Title is required')
      }
      if (!formData.description.trim()) {
        throw new Error('Description is required')
      }
      if (formData.distance <= 0) {
        throw new Error('Distance must be greater than 0')
      }
      if (formData.start_date >= formData.end_date) {
        throw new Error('End date must be after start date')
      }

      const submitData = {
        ...formData,
        ...(initialData && { id: initialData.id }),
        start_date: formData.start_date.toISOString(),
        end_date: formData.end_date.toISOString()
      }

      await onSubmit(submitData)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === 'create' ? 'Create New Trip' : 'Edit Trip'}
      </DialogTitle>
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Title"
            fullWidth
            value={formData.title}
            onChange={handleChange('title')}
            required
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange('description')}
            required
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={formData.difficulty}
                onChange={handleChange('difficulty')}
                label="Difficulty"
              >
                <MenuItem value="EASY">Easy</MenuItem>
                <MenuItem value="MODERATE">Moderate</MenuItem>
                <MenuItem value="DIFFICULT">Difficult</MenuItem>
                <MenuItem value="EXPERT">Expert</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Distance (km)"
              type="number"
              fullWidth
              value={formData.distance}
              onChange={handleChange('distance')}
              required
            />
          </Box>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <DatePicker
                label="Start Date"
                value={formData.start_date}
                onChange={handleDateChange('start_date')}
                sx={{ flex: 1 }}
              />
              <DatePicker
                label="End Date"
                value={formData.end_date}
                onChange={handleDateChange('end_date')}
                sx={{ flex: 1 }}
              />
            </Box>
          </LocalizationProvider>

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Trip Images
            </Typography>
            <ImageUpload
              images={formData.images}
              onChange={handleImagesChange}
              maxImages={10}
            />
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={formData.is_premium}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  is_premium: e.target.checked
                }))}
              />
            }
            label="Premium Trip"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Saving...' : mode === 'create' ? 'Create Trip' : 'Update Trip'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TripForm