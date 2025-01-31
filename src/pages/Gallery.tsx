import { useState, useEffect } from 'react'
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  ImageList,
  ImageListItem,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Modal
} from '@mui/material'
import axios from 'axios'
import { Folder as FolderIcon } from '@mui/icons-material'

interface Image {
  path: string
  url: string
  name: string
}

const Gallery = () => {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'))
  
  const [directoryPath, setDirectoryPath] = useState('')
  const [images, setImages] = useState<Image[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<Image | null>(null)

  const loadImages = async () => {
    if (!directoryPath.trim()) {
      setError('Please enter a directory path')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await axios.post('/api/admin/gallery/load', {
        path: directoryPath
      })
      setImages(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load images')
      setImages([])
    } finally {
      setLoading(false)
    }
  }

  const getCols = () => {
    if (isSmallScreen) return 1
    if (isMediumScreen) return 2
    return 3
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 2,
          background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
          color: 'white'
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{ 
            fontWeight: 600,
            mb: 3,
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          Image Gallery
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter directory path"
            value={directoryPath}
            onChange={(e) => setDirectoryPath(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                '&:hover': {
                  backgroundColor: 'white'
                }
              }
            }}
            InputProps={{
              startAdornment: (
                <FolderIcon sx={{ color: 'primary.main', mr: 1 }} />
              )
            }}
          />
          <Button
            variant="contained"
            onClick={loadImages}
            disabled={loading}
            sx={{
              height: 56,
              minWidth: 120,
              backgroundColor: 'white',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)'
              }
            }}
          >
            {loading ? 'Loading...' : 'Load Images'}
          </Button>
        </Box>
      </Paper>

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
          sx={{
            p: 3,
            borderRadius: 2,
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: theme.shadows[4]
            }
          }}
        >
          <ImageList 
            cols={getCols()} 
            gap={16}
            sx={{
              mb: 0,
              '& .MuiImageListItem-root': {
                overflow: 'hidden',
                borderRadius: 2
              }
            }}
          >
            {images.map((image, index) => (
              <ImageListItem 
                key={index}
                sx={{
                  cursor: 'pointer',
                  '& img': {
                    transition: 'transform 0.3s ease, filter 0.3s ease',
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
                    borderRadius: theme.shape.borderRadius
                  }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Paper>
      ) : directoryPath && (
        <Paper
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 2,
            backgroundColor: theme.palette.action.hover
          }}
        >
          <Typography color="text.secondary">
            No images found in the specified directory
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
        <Box
          sx={{
            position: 'relative',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'hidden',
            borderRadius: 2,
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
              style={{
                boxShadow: theme.shadows[24],
                backgroundColor: 'white'
              }}
            />
          )}
        </Box>
      </Modal>
    </Container>
  )
}

export default Gallery