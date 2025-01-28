import React, { useState, useEffect } from 'react';
import {
  Grid,
  Box,
  Typography,
  Container,
  Pagination,
  CircularProgress,
  Alert,
} from '@mui/material';
import TripCard from './TripCard';
import TripFilter, { FilterValues } from './TripFilter';
import { tripsApi, TripResponse } from '../../services/api/trips';

const TripList: React.FC = () => {
  const [trips, setTrips] = useState<TripResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<FilterValues>({
    search: '',
    location: '',
    startDate: null,
    endDate: null,
    priceRange: [0, 1000],
    capacity: 1,
    sortBy: 'date',
    categories: [],
    tags: [],
  });

  const fetchTrips = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await tripsApi.getTrips({
        page,
        ...filters,
        minPrice: filters.priceRange[0],
        maxPrice: filters.priceRange[1],
        categories: filters.categories,
        tags: filters.tags,
      });

      setTrips(response.trips);
      setTotalPages(Math.ceil(response.total / response.perPage));
    } catch (err) {
      setError('Failed to load trips. Please try again later.');
      console.error('Error fetching trips:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [page, filters]);

  const handleFilterChange = (newFilters: FilterValues) => {
    setPage(1); // Reset to first page when filters change
    setFilters(newFilters);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && page === 1) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <TripFilter
        onFilter={handleFilterChange}
        minPrice={0}
        maxPrice={1000}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!loading && trips.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No trips found matching your criteria
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {trips.map((trip) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={trip.id}>
                <TripCard trip={trip} />
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default TripList;
