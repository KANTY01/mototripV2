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
import { submitReview, selectReviewStatus, selectReviewError } from '../../store/slices/reviewSlice'

interface ReviewFormProps {
  tripId: number
  onSuccess: () => void
}

const ReviewForm = ({ tripId, onSuccess }: ReviewFormProps) => {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const [rating, setRating] = useState<number | null>(null)
  const [content, setContent] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [validationError, setValidationError] = useState<string | null>(null)
  const dispatch = useDispatch<AppDispatch>()
  const status = useSelector(selectReviewStatus)
  const error = useSelector(selectReviewError)
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const newFiles: File[] = []
    const newUrls: string[] = []

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        newFiles.push(file)
        newUrls.push(URL.createObjectURL(file))
      }
    })

    setImages(prev => [...prev, ...newFiles])
    setImageUrls(prev => [...prev, ...newUrls])
  }

  const handleRemoveImage = (index: number) => {
    URL.revokeObjectURL(imageUrls[index])
    setImages(prev => prev.filter((_, i) => i !== index))
    setImageUrls(prev => prev.filter((_, i) => i !== index))
  }

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

    const formData = new FormData()
    formData.append('rating', rating.toString())
    formData.append('content', content)
    images.forEach(image => {
      formData.append('images', image)
    })

    const resultAction = await dispatch(submitReview({ tripId, formData }))
    
    if (submitReview.fulfilled.match(resultAction)) {
      setRating(null)
      setContent('')
      setImages([])
      setImageUrls([])
      onSuccess()
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {(error || validationError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {validationError || error}
        </Alert>
      )}

      <Box sx={{ mb: 2 }}>
        <Typography component="legend">Rating *</Typography>
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
        sx={{ mb: 2 }}
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
          <Button variant="outlined" component="span">
            Add Photos
          </Button>
        </label>
      </Box>

      {imageUrls.length > 0 && (
        <ImageList
          variant="masonry"
          cols={isSmallScreen ? 2 : 3}
          gap={8}
          sx={{ mb: 2 }}
        >
          {imageUrls.map((url, index) => (
            <ImageListItem key={index} sx={{ position: 'relative' }}>
              <img
                src={url}
                alt={`Review preview ${index + 1}`}
                loading="lazy"
                style={{ borderRadius: `${theme.shape.borderRadius}px` }}
              />
              <IconButton
                size="small"
                onClick={() => handleRemoveImage(index)}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)'
                  }
                }}
              >
                <DeleteIcon sx={{ color: 'white' }} />
              </IconButton>
            </ImageListItem>
          ))}
        </ImageList>
      )}

      <Button
        type="submit"
        variant="contained"
        disabled={status === 'loading'}
        fullWidth
      >
        {status === 'loading' ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={20} />
            <span>Submitting...</span>
          </Box>
        ) : (
          'Submit Review'
        )}
      </Button>
    </Box>
  )
}

export default ReviewForm
