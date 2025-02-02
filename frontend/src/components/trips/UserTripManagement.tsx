import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  IconButton,
  Button,
  Chip,
  Alert,
  CircularProgress,
  Stack
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { tripApi, Trip as ApiTrip } from '../../api/trips';
import TripImageDialog from '../admin/TripImageDialog';
import UserTripEditDialog, { EditTripData } from './UserTripEditDialog';
import { useAuth } from '../../hooks/useAuth';

interface TripImage {
  image_url: string;
}

// Extend ApiTrip to include backend response fields
type ExtendedApiTrip = ApiTrip & { TripImages?: TripImage[]; created_at?: string; is_premium?: boolean };

interface Trip {
  id: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'moderate' | 'hard';
  distance: number;
  start_date: string;
  end_date: string;
  duration: string;
  is_premium: boolean;
  status: 'active' | 'draft' | 'archived';
  imageUrls: string[];
  createdAt: string;
  rating: number;
  reviewCount: number;
}

const UserTripManagement: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchTrips();
  }, [page, rowsPerPage]);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      if (!user?.id) return;
      const response = await tripApi.getTrips(
        { userId: user.id },
        page + 1,
        rowsPerPage
      );
      setTrips(response.trips.map(mapApiTripToTrip));
      setTotalItems(response.pagination.total_items);
      setPage(response.pagination.current_page - 1);
      setError(null);
    } catch (err) {
      setError('Failed to load trips');
      console.error('Trip loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const mapApiTripToTrip = (apiTrip: ExtendedApiTrip): Trip => ({
    id: apiTrip.id || 0,
    title: apiTrip.title || '',
    description: apiTrip.description || '',
    difficulty: apiTrip.difficulty || 'easy',
    distance: apiTrip.distance || 0,
    start_date: apiTrip.start_date || '',
    end_date: apiTrip.end_date || '',
    duration: calculateDuration(apiTrip.start_date, apiTrip.end_date),
    is_premium: apiTrip.is_premium || false,
    status: 'active',
    imageUrls: (apiTrip.TripImages || []).map(img => img.image_url),
    createdAt: apiTrip.created_at || new Date().toISOString(),
    rating: 0,
    reviewCount: 0
  });

  const calculateDuration = (startDate: string, endDate: string): string => {
    if (!startDate || !endDate) return '';
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return `${days} days`;
  };


  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditTrip = (trip: Trip) => {
    setSelectedTrip(trip);
    setEditDialogOpen(true);
  };

  const handleManageImages = (trip: Trip) => {
    setSelectedTrip(trip);
    setImageDialogOpen(true);
  };

  const handleDeleteTrip = async (tripId: number) => {
    try {
      await tripApi.deleteTrip(tripId);
      setActionSuccess('Trip deleted successfully');
      // Reset to first page after deletion
      setPage(0);
    } catch (err) {
      setError('Failed to delete trip');
    }
  };

  const handleSaveTrip = async (data: EditTripData): Promise<void> => {
    try {
      if (selectedTrip) {
        await tripApi.updateTrip(selectedTrip.id, {
          ...data,
          location: {
            latitude: 0,
            longitude: 0
          }
        });
      } else {
        await tripApi.createTrip({
          ...data,
          location: { latitude: 0, longitude: 0 }
        });
      }
      // Reset to first page and fetch trips
      setPage(0);
      setEditDialogOpen(false);
      setActionSuccess(selectedTrip ? 'Trip updated successfully' : 'Trip created successfully');
    } catch (err) {
      setError('Failed to save trip');
      throw err;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {actionSuccess && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setActionSuccess(null)}>
          {actionSuccess}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          mb: 2,
          border: 1,
          borderColor: 'divider',
          borderRadius: 1
        }}
      >
        <Stack direction="row" spacing={2} sx={{ flex: '1 1 100%' }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => {
              setSelectedTrip(null);
              setEditDialogOpen(true);
            }}
            sx={{ px: 3 }}
          >
            Add New Trip
          </Button>
        </Stack>
      </Paper>

      <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'action.hover' }}>
                <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Difficulty</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Distance</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Duration</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Rating</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {trips.map((trip) => (
                <TableRow key={trip.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {trip.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={trip.difficulty}
                      color={
                        trip.difficulty === 'easy'
                          ? 'success'
                          : trip.difficulty === 'moderate'
                          ? 'warning'
                          : 'error'
                      }
                      sx={{ minWidth: 70 }}
                    />
                  </TableCell>
                  <TableCell>{trip.distance} km</TableCell>
                  <TableCell>{trip.duration}</TableCell>
                  <TableCell>
                    <Chip
                      label={trip.status}
                      color={
                        trip.status === 'active'
                          ? 'success'
                          : trip.status === 'draft'
                          ? 'warning'
                          : 'default'
                      }
                      sx={{ minWidth: 70 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {(trip.rating || 0).toFixed(1)} ({trip.reviewCount || 0})
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <IconButton
                      size="small"
                      onClick={() => handleEditTrip(trip)}
                      aria-label="edit"
                      sx={{ 
                        mr: 1,
                        '&:hover': { 
                          backgroundColor: 'action.hover' 
                        } 
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleManageImages(trip)}
                      aria-label="manage images"
                      sx={{ 
                        mr: 1,
                        '&:hover': { 
                          backgroundColor: 'action.hover' 
                        } 
                      }}
                    >
                      <ImageIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteTrip(trip.id)}
                      aria-label="delete"
                      color="error"
                      sx={{ 
                        '&:hover': { 
                          backgroundColor: 'error.lighter' 
                        } 
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalItems}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ borderTop: 1, borderColor: 'divider' }}
        />
      </Paper>

      {/* Image Management Dialog */}
      {selectedTrip && (
        <TripImageDialog
          open={imageDialogOpen}
          onClose={() => setImageDialogOpen(false)}
          tripId={selectedTrip.id}
          images={(selectedTrip.imageUrls || []).map((url, index) => ({
            id: index,
            url,
            order: index
          }))}
          onImagesUpdate={() => {
            // Refresh the current page
            fetchTrips();
            setImageDialogOpen(false);
          }}
        />
      )}

      {/* Edit Trip Dialog */}
      {editDialogOpen && (
        <UserTripEditDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          trip={selectedTrip}
          onSave={handleSaveTrip}
        />
      )}
    </Box>
  );
};

export default UserTripManagement;