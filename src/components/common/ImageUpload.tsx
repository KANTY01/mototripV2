import { useState, useCallback } from 'react'
import { Box, Button, Typography, IconButton, ImageList, ImageListItem } from '@mui/material'
import { styled } from '@mui/material/styles'
import DeleteIcon from '@mui/icons-material/Delete'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: 1,
})

export interface ImageUploadProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
  maxSize?: number
  allowedTypes?: string[]
}

const ImageUpload = ({
  images,
  onChange,
  maxImages = 10,
  maxSize = 5 * 1024 * 1024, // 5MB
  allowedTypes = ['image/jpeg', 'image/png']
}: ImageUploadProps) => {
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || [])
      
      if (images.length + files.length > maxImages) {
        setError(`Maximum ${maxImages} images allowed`)
        return
      }

      const invalidFile = files.find(file => !allowedTypes.includes(file.type))
      if (invalidFile) {
        setError('Only JPG and PNG files are allowed')
        return
      }

      const oversizedFile = files.find(file => file.size > maxSize)
      if (oversizedFile) {
        setError(`File size must be less than ${maxSize / 1024 / 1024}MB`)
        return
      }

      setError(null)
      
      const newImages = await Promise.all(
        files.map(file => new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.readAsDataURL(file)
        }))
      )

      onChange([...images, ...newImages])
    },
    [images, onChange, maxImages, maxSize, allowedTypes]
  )

  const handleDelete = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onChange(newImages)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button
          component="label"
          variant="contained"
          startIcon={<AddPhotoAlternateIcon />}
          disabled={images.length >= maxImages}
          sx={{ width: 'fit-content' }}
        >
          Upload Images
          <VisuallyHiddenInput
            type="file"
            accept={allowedTypes.join(',')}
            onChange={handleFileChange}
            multiple
          />
        </Button>
        <Typography variant="body2" color="text.secondary">
          {images.length} / {maxImages} images
        </Typography>
      </Box>

      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}

      {images.length > 0 && (
        <ImageList 
          cols={3} 
          gap={8}
          sx={{
            mt: 2,
            mb: 0
          }}
        >
          {images.map((image, index) => (
            <ImageListItem 
              key={index}
              sx={{
                borderRadius: 1,
                overflow: 'hidden',
                position: 'relative',
                '&:hover .delete-button': {
                  opacity: 1
                }
              }}
            >
              <img
                src={image}
                alt={`Upload ${index + 1}`}
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  aspectRatio: '1'
                }}
              />
              <IconButton
                className="delete-button"
                size="small"
                onClick={() => handleDelete(index)}
                sx={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)'
                  }
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </ImageListItem>
          ))}
        </ImageList>
      )}
    </Box>
  )
}

export default ImageUpload
