import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

const UploadBox = styled(Paper)(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'border-color 0.2s ease-in-out',
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
}));

const PreviewImage = styled('img')({
  maxWidth: '100%',
  maxHeight: '200px',
  objectFit: 'contain',
});

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  onImageClear: () => void;
  error?: string;
  loading?: boolean;
  previewUrl?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  onImageClear,
  error,
  loading,
  previewUrl,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
          onImageSelect(file);
        }
      }
    },
    [onImageSelect]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
          onImageSelect(file);
        }
      }
    },
    [onImageSelect]
  );

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {previewUrl ? (
        <Box sx={{ position: 'relative', mb: 2 }}>
          <PreviewImage src={previewUrl} alt="Preview" />
          <IconButton
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'background.paper',
            }}
            onClick={onImageClear}
            disabled={loading}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ) : (
        <UploadBox
          onDragEnter={handleDragEnter}
          onDragOver={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          sx={{
            bgcolor: isDragging ? 'action.hover' : 'background.paper',
            position: 'relative',
          }}
        >
          <Box
            component="label"
            htmlFor="image-upload"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              cursor: 'pointer',
            }}
          >
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                cursor: 'pointer',
              }}
              disabled={loading}
              aria-label="Upload image"
              title="Choose an image file to upload"
            />
          </Box>
          {loading ? (
            <CircularProgress size={40} />
          ) : (
            <>
              <CloudUploadIcon sx={{ fontSize: 48, color: 'action.active', mb: 1 }} />
              <Typography variant="body1" gutterBottom>
                Drag and drop an image here, or click to select
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Supported formats: JPG, PNG, GIF (max 5MB)
              </Typography>
            </>
          )}
        </UploadBox>
      )}
    </Box>
  );
};

export default ImageUpload;
