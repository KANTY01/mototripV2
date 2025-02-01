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
  TextField,
  MenuItem,
  Checkbox,
  Toolbar,
  Menu,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  FormControl,
  InputLabel,
  Select,
  Grid
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { adminApi, TripFilters, TripUpdateData } from '../../api/admin';
import TripImageDialog from './TripImageDialog';
import TripEditDialog, { EditTripData } from './TripEditDialog';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';

interface Trip {
  id: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'moderate' | 'hard';
  distance: number;
  start_date: string;
  end_date: string;
  duration: string;
  isPremium: boolean;
  status: 'active' | 'draft' | 'archived';
  imageUrls: string[];
  createdAt: string;
  rating: number;
  reviewCount: number;
}

const TripManagement: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState<TripFilters>({});
  const [selectedTrips, setSelectedTrips] = useState<number[]>([]);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [bulkActionAnchorEl, setBulkActionAnchorEl] = useState<null | HTMLElement>(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchTrips();
  }, [page, rowsPerPage, filters]);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getTrips({
        ...filters,
        page: page + 1,
        perPage: rowsPerPage
      });
      setTrips(response);
      setError(null);
    } catch (err) {
      setError('Failed to load trips');
      console.error('Trip loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedTrips(trips.map(trip => trip.id));
    } else {
      setSelectedTrips([]);
    }
  };

  const handleSelectTrip = (tripId: number) => {
    setSelectedTrips(prev => {
      if (prev.includes(tripId)) {
        return prev.filter(id => id !== tripId);
      }
      return [...prev, tripId];
    });
  };

  const handleBulkAction = async (action: 'delete' | 'activate' | 'archive') => {
    if (!selectedTrips.length) return;

    try {
      if (action === 'delete') {
        await adminApi.bulkDeleteTrips(selectedTrips);
        setActionSuccess('Selected trips deleted successfully');
      } else {
        await adminApi.bulkUpdateTrips(selectedTrips, {
          status: action === 'activate' ? 'active' : 'archived'
        });
        setActionSuccess(`Selected trips ${action === 'activate' ? 'activated' : 'archived'} successfully`);
      }
      fetchTrips();
      setSelectedTrips([]);
    } catch (err) {
      setError(`Failed to ${action} selected trips`);
    }
    setBulkActionAnchorEl(null);
  };

  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      const blob = await adminApi.exportTrips(format, filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `trips-${format === 'csv' ? 'data.csv' : 'report.pdf'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to export trips');
    }
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
      await adminApi.deleteTrip(tripId);
      setActionSuccess('Trip deleted successfully');
      fetchTrips();
    } catch (err) {
      setError('Failed to delete trip');
    }
  };

  const handleApplyFilters = (newFilters: TripFilters) => {
    setFilters(newFilters);
    setPage(0);
    setFilterDialogOpen(false);
  };

  const handleSaveTrip = async (data: EditTripData): Promise<void> => {
    try {
      await fetchTrips();
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
          {selectedTrips.length > 0 && (
            <>
              <Button
                onClick={(e) => setBulkActionAnchorEl(e.currentTarget)}
                variant="outlined"
                size="small"
                color="inherit"
              >
                Bulk Actions ({selectedTrips.length})
              </Button>
              <Menu
                anchorEl={bulkActionAnchorEl}
                open={Boolean(bulkActionAnchorEl)}
                onClose={() => setBulkActionAnchorEl(null)}
              >
                <MenuItem 
                  onClick={() => handleBulkAction('activate')}
                  sx={{ minWidth: 150 }}
                >
                  Activate Selected
                </MenuItem>
                <MenuItem 
                  onClick={() => handleBulkAction('archive')}
                  sx={{ minWidth: 150 }}
                >
                  Archive Selected
                </MenuItem>
                <MenuItem 
                  onClick={() => handleBulkAction('delete')}
                  sx={{ minWidth: 150, color: 'error.main' }}
                >
                  Delete Selected
                </MenuItem>
              </Menu>
            </>
          )}
          <Button
            startIcon={<FilterIcon />}
            onClick={() => setFilterDialogOpen(true)}
            variant="outlined"
            size="small"
            color="inherit"
          >
            Filters
          </Button>
          <Button
            startIcon={<DownloadIcon />}
            onClick={() => handleExport('csv')}
            variant="outlined"
            size="small"
            color="inherit"
          >
            Export
          </Button>
        </Stack>
      </Paper>

      <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'action.hover' }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedTrips.length > 0 && selectedTrips.length < trips.length}
                    checked={selectedTrips.length === trips.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Difficulty</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Distance</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Duration</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Premium</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Rating</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {trips.map((trip) => (
                <TableRow key={trip.id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedTrips.includes(trip.id)}
                      onChange={() => handleSelectTrip(trip.id)}
                    />
                  </TableCell>
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
                      label={trip.isPremium ? 'Premium' : 'Standard'}
                      color={trip.isPremium ? 'primary' : 'default'}
                      sx={{ minWidth: 70 }}
                    />
                  </TableCell>
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
          count={trips.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ borderTop: 1, borderColor: 'divider' }}
        />
      </Paper>

      {/* Filter Dialog */}
      <Dialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        maxWidth="md"
        PaperProps={{
          sx: { borderRadius: 1 }
        }}
      >
        <DialogTitle>Filter Trips</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Search"
                value={filters.search || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Difficulty</InputLabel>
                <Select
                  value={filters.difficulty || ''}
                  label="Difficulty"
                  onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="easy">Easy</MenuItem>
                  <MenuItem value="moderate">Moderate</MenuItem>
                  <MenuItem value="hard">Hard</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status || ''}
                  label="Status"
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="archived">Archived</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Premium</InputLabel>
                <Select
                  value={filters.isPremium === undefined ? '' : filters.isPremium.toString()}
                  label="Premium"
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    isPremium: e.target.value === '' ? undefined : e.target.value === 'true'
                  }))}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="true">Premium</MenuItem>
                  <MenuItem value="false">Standard</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Min Distance (km)"
                value={filters.minDistance || ''}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  minDistance: e.target.value ? Number(e.target.value) : undefined
                }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Max Distance (km)"
                value={filters.maxDistance || ''}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  maxDistance: e.target.value ? Number(e.target.value) : undefined
                }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setFilters({});
            setFilterDialogOpen(false);
          }}>
            Clear
          </Button>
          <Button onClick={() => setFilterDialogOpen(false)} variant="contained">
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Management Dialog */}
      {selectedTrip && (
        <TripImageDialog
          open={imageDialogOpen}
          onClose={() => setImageDialogOpen(false)}
          tripId={selectedTrip.id}
          images={selectedTrip.imageUrls.map((url, index) => ({
            id: index,
            url,
            order: index
          }))}
          onImagesUpdate={fetchTrips}
        />
      )}

      {/* Edit Trip Dialog */}
      {editDialogOpen && (
        <TripEditDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          trip={selectedTrip}
          onSave={handleSaveTrip}
        />
      )}
    </Box>
  );
};

export default TripManagement;
