import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Box,
  Button,
  Grid,
  Slider,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Collapse,
  Chip,
  Autocomplete,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import { TripCategory, TRIP_CATEGORIES, COMMON_TAGS } from '../../types/trip';

export interface FilterValues {
  search: string;
  location: string;
  startDate: Date | null;
  endDate: Date | null;
  priceRange: [number, number];
  capacity: number;
  sortBy: string;
  categories: TripCategory[];
  tags: string[];
}

interface TripFilterProps {
  onFilter: (filters: FilterValues) => void;
  minPrice?: number;
  maxPrice?: number;
}

const TripFilter: React.FC<TripFilterProps> = ({
  onFilter,
  minPrice = 0,
  maxPrice = 1000,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({
    search: '',
    location: '',
    startDate: null,
    endDate: null,
    priceRange: [minPrice, maxPrice],
    capacity: 1,
    sortBy: 'date',
    categories: [],
    tags: [],
  });

  const handleFilterChange = (field: keyof FilterValues, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleClear = () => {
    const clearedFilters: FilterValues = {
      search: '',
      location: '',
      startDate: null,
      endDate: null,
      priceRange: [minPrice, maxPrice],
      capacity: 1,
      sortBy: 'date',
      categories: [],
      tags: [],
    };
    setFilters(clearedFilters);
    onFilter(clearedFilters);
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Search trips"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Location"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  onClick={() => setShowFilters(!showFilters)}
                  startIcon={<FilterListIcon />}
                >
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                >
                  Search
                </Button>
                <IconButton onClick={handleClear} size="small">
                  <ClearIcon />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Collapse in={showFilters}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Start Date"
                value={filters.startDate}
                onChange={(date) => handleFilterChange('startDate', date)}
                slotProps={{ textField: { fullWidth: true, size: 'small' } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="End Date"
                value={filters.endDate}
                onChange={(date) => handleFilterChange('endDate', date)}
                slotProps={{ textField: { fullWidth: true, size: 'small' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom>Price Range</Typography>
              <Slider
                value={filters.priceRange}
                onChange={(_, value) => handleFilterChange('priceRange', value as [number, number])}
                valueLabelDisplay="auto"
                min={minPrice}
                max={maxPrice}
                marks={[
                  { value: minPrice, label: `$${minPrice}` },
                  { value: maxPrice, label: `$${maxPrice}` },
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Minimum Capacity"
                value={filters.capacity}
                onChange={(e) => handleFilterChange('capacity', parseInt(e.target.value))}
                inputProps={{ min: 1 }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={filters.sortBy}
                  label="Sort By"
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                >
                  <MenuItem value="date">Date</MenuItem>
                  <MenuItem value="price-low">Price: Low to High</MenuItem>
                  <MenuItem value="price-high">Price: High to Low</MenuItem>
                  <MenuItem value="rating">Rating</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Autocomplete
                multiple
                id="categories"
                options={TRIP_CATEGORIES}
                value={TRIP_CATEGORIES.filter(cat => filters.categories.includes(cat.value))}
                onChange={(_, newValue) => {
                  handleFilterChange('categories', newValue.map(cat => cat.value));
                }}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Categories"
                    size="small"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option.label}
                      {...getTagProps({ index })}
                      key={option.value}
                    />
                  ))
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Autocomplete
                multiple
                id="tags"
                options={COMMON_TAGS}
                value={filters.tags}
                onChange={(_, newValue) => {
                  handleFilterChange('tags', newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tags"
                    size="small"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      {...getTagProps({ index })}
                      key={option}
                    />
                  ))
                }
                freeSolo
              />
            </Grid>
          </Grid>
        </Collapse>
      </form>
    </Paper>
  );
};

export default TripFilter;
