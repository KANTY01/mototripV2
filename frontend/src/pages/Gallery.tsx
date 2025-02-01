import { useState, useEffect } from 'react'
import {
  Container,
  Paper,
  Typography,
  Box,
  ImageList,
  ImageListItem,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Modal
} from '@mui/material'
import api from '../api/axiosConfig'

interface Image {
  path: string
  url: string
  name: string
}

const Gallery = () => {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'))
  
  const [images, setImages] = useState<Image[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<Image | null>(null)

  const loadImages = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await api.get('/gallery')
      setImages(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load images')
    } finally {
      setLoading(false)
    }
  }

  // Load images initially and set up auto-refresh
  useEffect(() => {
    loadImages()
    
    // Refresh images every 30 seconds
    const interval = setInterval(loadImages, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const getCols = () => {
    if (isSmallScreen) return 1
    if (isMediumScreen) return 2
    return 3
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography 
          variant="h3" 
          component="h1"
          sx={{ 
            fontWeight: 700,
            mb: 2
          }}
        >
          Image Gallery
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary"
          sx={{ maxWidth: 600, mx: 'auto' }}
        >
          Browse your motorcycle journey photos
        </Typography>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          onClose={() => setError(null)}
          sx={{ mb: 4 }}
        >
          {error}
        </Alert>
      )}

      {loading ? (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 400
          }}
        >
          <CircularProgress />
        </Box>
      ) : images.length > 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper
          }}
        >
          <ImageList 
            cols={getCols()} 
            gap={16}
            sx={{
              mb: 0,
              '& .MuiImageListItem-root': {
                overflow: 'hidden',
                borderRadius: 1
              }
            }}
          >
            {images.map((image, index) => (
              <ImageListItem 
                key={index}
                sx={{
                  cursor: 'pointer',
                  '& img': {
                    transition: 'all 0.3s ease',
                  },
                  '&:hover img': {
                    transform: 'scale(1.05)',
                    filter: 'brightness(1.1)'
                  }
                }}
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image.url}
                  alt={image.name}
                  loading="lazy"
                  style={{
                    borderRadius: theme.shape.borderRadius,
                    border: `1px solid ${theme.palette.divider}`
                  }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Paper>
      ) : (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: 'center',
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper
          }}
        >
          <Typography 
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            No images found in the gallery
          </Typography>
        </Paper>
      )}

      <Modal
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2
        }}
      >
        <Paper
          elevation={0}
          sx={{
            position: 'relative',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'hidden',
            borderRadius: 1,
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
            '& img': {
              maxWidth: '100%',
              maxHeight: '90vh',
              objectFit: 'contain'
            }
          }}
        >
          {selectedImage && (
            <img
              src={selectedImage.url}
              alt={selectedImage.name}
            />
          )}
        </Paper>
      </Modal>
    </Container>
  )
}

export default Gallery