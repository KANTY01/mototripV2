import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  ImageList,
  ImageListItem,
  IconButton,
  Box,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { DragDropContext, Draggable, DraggableProvided, DropResult } from '@hello-pangea/dnd';
import { adminApi } from '../../api/admin';
import StrictModeDroppable from '../common/StrictModeDroppable';

interface TripImage {
  id: number;
  url: string;
  order: number;
}

interface TripImageDialogProps {
  open: boolean;
  onClose: () => void;
  tripId: number;
  images: TripImage[];
  onImagesUpdate: () => void;
}

const TripImageDialog: React.FC<TripImageDialogProps> = ({
  open,
  onClose,
  tripId,
  images,
  onImagesUpdate
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderedImages, setOrderedImages] = useState<TripImage[]>(
    [...images].sort((a, b) => a.order - b.order)
  );

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('images', file);
    });

    try {
      setLoading(true);
      await adminApi.updateTripImages(tripId, formData);
      onImagesUpdate();
      setError(null);
    } catch (err) {
      setError('Failed to upload images');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    try {
      setLoading(true);
      await adminApi.deleteTripImage(tripId, imageId);
      setOrderedImages(prev => prev.filter(img => img.id !== imageId));
      onImagesUpdate();
      setError(null);
    } catch (err) {
      setError('Failed to delete image');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(orderedImages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setOrderedImages(items);

    try {
      setLoading(true);
      await adminApi.reorderTripImages(
        tripId,
        items.map(item => item.id)
      );
      onImagesUpdate();
      setError(null);
    } catch (err) {
      setError('Failed to reorder images');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Manage Trip Images</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 2 }}>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="image-upload"
            multiple
            type="file"
            onChange={handleFileSelect}
          />
          <label htmlFor="image-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<AddIcon />}
              disabled={loading}
            >
              Add Images
            </Button>
          </label>
        </Box>

        <DragDropContext onDragEnd={handleDragEnd}>
          <StrictModeDroppable droppableId="trip-images">
            {(provided) => (
              <Box
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <ImageList cols={3} gap={8} sx={{ mb: 0 }}>
                  {orderedImages.map((image, index) => (
                    <Draggable
                      key={image.id}
                      draggableId={image.id.toString()}
                      index={index}
                    >
                      {(provided: DraggableProvided) => (
                        <ImageListItem
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <img
                            src={image.url}
                            alt={`Trip image ${index + 1}`}
                            loading="lazy"
                            style={{ borderRadius: 4 }}
                          />
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 0,
                              right: 0,
                              p: 0.5,
                              backgroundColor: 'rgba(0, 0, 0, 0.5)',
                              borderRadius: '0 4px 0 4px'
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteImage(image.id)}
                              sx={{ color: 'white' }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              p: 1,
                              backgroundColor: 'rgba(0, 0, 0, 0.5)',
                              color: 'white',
                              textAlign: 'center'
                            }}
                          >
                            Drag to reorder
                          </Typography>
                        </ImageListItem>
                      )}
                    </Draggable>
                  ))}
                </ImageList>
                {provided.placeholder}
              </Box>
            )}
          </StrictModeDroppable>
        </DragDropContext>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TripImageDialog;