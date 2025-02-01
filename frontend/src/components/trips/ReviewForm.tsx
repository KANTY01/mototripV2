import { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  Rating,
  Typography,
  Alert,
  Paper,
  IconButton,
  ImageList,
  ImageListItem,
  useTheme,
  useMediaQuery,
  CircularProgress
} from '@mui/material'
import { Delete as DeleteIcon } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store/store'
import { submitReview, selectReviewStatus, selectReviewError, ReviewState } from '../../store/slices/reviewSlice'
import { Review } from '../../types'

interface ReviewFormProps {
  tripId: number
  onSuccess: () => void
  existingReview?: {
    id?: number
    rating?: number
    content?: string
    images?: string[]
  }
  onCancel?: () => void
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp'
];

const ReviewForm = ({ tripId, onSuccess, existingReview, onCancel }: ReviewFormProps) => {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const [rating, setRating] = useState<number | null>(existingReview?.rating || null)
  const [content, setContent] = useState(existingReview?.content || '')
  const [existingImages] = useState<string[]>(existingReview?.images || [])
  const [removedImages, setRemovedImages] = useState<string[]>([])
  const [validationError, setValidationError] = useState<string | null>(null)
  const [newImages, setNewImages] = useState<File[]>([])
  const [newImageUrls, setNewImageUrls] = useState<string[]>([])
  const dispatch = useDispatch<AppDispatch>()
  const status = useSelector<RootState, ReviewState['status']>(selectReviewStatus)
  const error = useSelector<RootState, ReviewState['error']>(selectReviewError)
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const newFiles: File[] = []
    const newUrls: string[] = []

    Array.from(files).forEach(file => {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        setValidationError(`File type ${file.type} is not supported. Please use JPEG, PNG, or WebP images.`)
        return
      }

      if (file.size > MAX_IMAGE_SIZE) {
        setValidationError(`File ${file.name} is too large. Maximum size is 5MB.`)
        return
      }

      if (newImages.length + existingImages.length - removedImages.length >= 5) {
        setValidationError('Maximum 5 images allowed per review.')
      } else {
        newFiles.push(file)
        newUrls.push(URL.createObjectURL(file))
      }
    })

    setNewImages(prev => [...prev, ...newFiles])
    setNewImageUrls(prev => [...prev, ...newUrls])
  }

  const handleRemoveImage = (type: 'existing' | 'new', index: number) => {
    if (type === 'existing') {
      setRemovedImages(prev => [...prev, existingImages[index]])
      setValidationError(null)
    } else {
      URL.revokeObjectURL(newImageUrls[index])
      setNewImages(prev => prev.filter((_, i) => i !== index))
      setNewImageUrls(prev => prev.filter((_, i) => i !== index))
    }
  }

  const allImages = [
    ...existingImages.filter(img => !removedImages.includes(img)),
    ...newImageUrls
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated) {
      setValidationError('You must be logged in to submit a review')
      return
    }
    if (!rating) {
      setValidationError('Please provide a rating')
      return
    }
    if (!content.trim()) {
      setValidationError('Please provide a review content')
      return
    }

    try {
      const formData = new FormData()
      formData.append('rating', rating.toString())
      formData.append('content', content)
      
      newImages.forEach(image => {
        formData.append('images', image)
      })
      
      if (existingReview?.id && removedImages.length > 0) {
        formData.append('removed_images', JSON.stringify(removedImages))
      }

      if (existingReview?.id) {
        await dispatch(submitReview({ 
          reviewId: existingReview.id,
          formData 
        }))
      } else {
        await dispatch(submitReview({ tripId, formData }))
      }
      
      onSuccess()
    } catch (err) {
      console.error('Failed to submit review:', err)
      setValidationError('Failed to save review. Please try again.')
    }
  }

  return (
    <Paper 
      component="form" 
      onSubmit={handleSubmit} 
      elevation={0}
      sx={{
        p: 3,
        border: 1,
        borderColor: 'divider'
      }}
    >
      {(error || validationError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {validationError || error}
        </Alert>
      )}

      <Box sx={{ mb: 2 }}>
        <Typography 
          component="legend" 
          variant="subtitle1" 
          color="text.primary" 
          gutterBottom
        >
          Rating *
        </Typography>
        <Rating
          value={rating}
          onChange={(_, newValue) => {
            setRating(newValue)
            setValidationError(null)
          }}
          size="large"
        />
      </Box>

      <TextField
        fullWidth
        multiline
        rows={4}
        label="Review *"
        value={content}
        onChange={(e) => {
          setContent(e.target.value)
          setValidationError(null)
        }}
        sx={{ mb: 3 }}
      />

      <Box sx={{ mb: 2 }}>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="review-image-upload"
          multiple
          type="file"
          onChange={handleImageChange}
        />
        <label htmlFor="review-image-upload">
          <Button 
            variant="outlined" 
            component="span"
            sx={{
              borderColor: 'divider',
              color: 'text.secondary',
              '&:hover': { borderColor: 'primary.main', color: 'primary.main' }
            }}
          >
            Add Photos
          </Button>
        </label>
      </Box>

      {allImages.length > 0 && (
        <ImageList
          variant="masonry"
          cols={isSmallScreen ? 2 : 3}
          gap={8}
          sx={{ mb: 3 }}
        >
          {allImages.map((url, index) => (
            <ImageListItem key={index} sx={{ position: 'relative' }}>
              <img 
                src={url}
                alt={`Review preview ${index + 1}`}
                loading="lazy"
                style={{ borderRadius: `${theme.shape.borderRadius}px` }}
              />
              <IconButton
                size="small"
                onClick={() => handleRemoveImage(index < existingImages.length ? 'existing' : 'new', index)}
                sx={{ 
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'action.disabledBackground',
                  '&:hover': {
                    bgcolor: 'action.disabled'
                  },
                }}
              >
                <DeleteIcon sx={{ color: 'white' }} />
              </IconButton>
            </ImageListItem>
          ))}
        </ImageList>
      )}
      
      <Box sx={{ display: 'flex', gap: 2 }}>
        {onCancel && (
          <Button
            variant="outlined"
            onClick={onCancel}
            fullWidth
            sx={{
              borderColor: 'divider',
              color: 'text.secondary',
              '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
              minWidth: 120
            }}
            disabled={status === 'loading'}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="contained"
          disabled={status === 'loading'}
          fullWidth
          sx={{ minWidth: 120 }}
        >
          {status === 'loading' ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} />
              <span>{existingReview?.id ? 'Saving...' : 'Submitting...'}</span>
            </Box>
          ) : (existingReview?.id ? 'Save Changes' : 'Submit Review')}
        </Button>
      </Box>
    </Paper>
  )
}

export default ReviewForm
