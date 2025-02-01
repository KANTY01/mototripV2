import { useState } from 'react'
import {
  Box,
  TextField,
  MenuItem,
  Grid,
  Button,
  Paper,
  IconButton,
  Collapse,
  Chip,
  Stack,
  Typography,
  Autocomplete,
  useTheme
} from '@mui/material'
import { 
  FilterList as FilterListIcon,
  LocationOn as LocationIcon 
} from '@mui/icons-material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider, DatePicker, DateValidationError } from '@mui/x-date-pickers'

interface TripFilters {
  difficulty?: string
  minDistance?: number
  maxDistance?: number
  startDate?: Date | null
  endDate?: Date | null
  location?: {
    latitude: number
    longitude: number
    radius: number
    address: string
  }
  terrain?: string[]
  season?: string[]
}

interface TripFiltersProps {
  onFilter: (filters: TripFilters) => void
  initialFilters?: Partial<TripFilters>
}

const difficulties = ['Easy', 'Moderate', 'Hard', 'Expert']
const terrainTypes = [
  'Mountain',
  'Coastal',
  'Forest',
  'Desert',
  'Urban',
  'Highway',
  'Countryside',
  'Mixed'
]
const seasons = [
  'Spring',
  'Summer',
  'Fall',
  'Winter',
  'All Year'
]

const TripFilters = ({ 
  onFilter,
  initialFilters = {}
}: TripFiltersProps) => {
  const theme = useTheme()
  const [isExpanded, setIsExpanded] = useState(false)
  const [filters, setFilters] = useState<TripFilters>({
    difficulty: undefined,
    minDistance: undefined,
    maxDistance: undefined,
    startDate: null,
    endDate: null,
    location: undefined,
    terrain: [],
    season: [],
    ...initialFilters
  })

  const handleTextFieldChange = (field: keyof TripFilters) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value
    setFilters((prev) => ({
      ...prev,
      [field]: field === 'minDistance' || field === 'maxDistance'
        ? value === '' ? undefined : Number(value)
        : value
    }))
  }

  const handleDateChange = (field: 'startDate' | 'endDate') => (
    value: Date | null,
    context: any
  ) => {
    if (context.validationError) return

    setFilters((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  interface PlaceResult extends google.maps.places.PlaceResult {
    geometry: {
      location: google.maps.LatLng;
    };
  }

  const handleLocationSelect = (place: PlaceResult | null) => {
    if (!place) {
      return
    }

    setFilters(prev => ({
      ...prev,
      location: {
        latitude: place.geometry.location.lat() as number,
        longitude: place.geometry.location.lng() as number,
        radius: prev.location?.radius || 50,
        address: place.formatted_address || place.name || ''
      }
    }))
  }

  const handleRadiusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const radius = Number(event.target.value)
    if (filters.location && !isNaN(radius) && radius > 0) {
      setFilters(prev => ({
        ...prev,
        location: {
          ...prev.location!,
          radius
        }
      }))
    }
  }

  const getActiveFilterCount = () => 
    Object.values(filters).filter(value => value !== undefined && value !== null && value !== '').length

  const handleApplyFilters = () => {
    onFilter(filters)
  }

  const handleClearFilters = () => {
    setFilters({
      difficulty: undefined,
      minDistance: undefined,
      maxDistance: undefined,
      startDate: null,
      endDate: null,
      location: undefined,
      terrain: [],
      season: []
    })
    onFilter({})
  }

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3,
        border: 1,
        borderColor: 'divider'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: isExpanded ? 2 : 0 }}>
        <IconButton 
          onClick={() => setIsExpanded(!isExpanded)} 
          size="small"
          sx={{
            color: 'primary.main',
            '&:hover': {
              bgcolor: 'action.hover'
            }
          }}
        >
          <FilterListIcon fontSize="small" />
        </IconButton>
        <Typography variant="h6" color="text.primary" sx={{ ml: 2 }}>
          Filters
          {getActiveFilterCount() > 0 && (
            <Chip
              label={getActiveFilterCount()}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 500, ml: 1 }}
            />
          )}
        </Typography>
      </Box>

      <Collapse in={isExpanded}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label="Difficulty"
                value={filters.difficulty || ''}
                onChange={handleTextFieldChange('difficulty')}
              >
                <MenuItem value="">
                  <em>Any</em>
                </MenuItem>
                {difficulties.map((difficulty) => (
                  <MenuItem key={difficulty} value={difficulty}>
                    {difficulty}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="number"
                label="Min Distance (km)"
                value={filters.minDistance || ''}
                onChange={handleTextFieldChange('minDistance')}
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="number"
                label="Max Distance (km)"
                value={filters.maxDistance || ''}
                onChange={handleTextFieldChange('maxDistance')}
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="Start Date"
                value={filters.startDate}
                onChange={handleDateChange('startDate')}
                slotProps={{
                  textField: {
                    fullWidth: true
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="End Date"
                value={filters.endDate}
                onChange={handleDateChange('endDate')}
                slotProps={{
                  textField: {
                    fullWidth: true
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Autocomplete
                multiple
                options={terrainTypes}
                value={filters.terrain || []}
                onChange={(_, newValue) => {
                  setFilters(prev => ({
                    ...prev,
                    terrain: newValue
                  }))
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Terrain Types"
                    placeholder="Select terrains"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Autocomplete
                multiple
                options={seasons}
                value={filters.season || []}
                onChange={(_, newValue) => {
                  setFilters(prev => ({
                    ...prev,
                    season: newValue
                  }))
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Recommended Seasons"
                    placeholder="Select seasons"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Location Filter
              </Typography>
              <Stack direction="row" spacing={2}>
                <TextField
                  fullWidth
                  label="Search Location"
                  placeholder="Enter a location"
                  InputProps={{
                    startAdornment: (
                      <LocationIcon 
                        sx={{ 
                          color: 'text.secondary',
                          mr: 1
                        }} 
                      />)
                  }}
                  value={filters.location?.address || ''}
                  onChange={(e) => {
                    if (!e.target.value) {
                      setFilters(prev => ({
                        ...prev,
                        location: undefined
                      }))
                    }
                  }}
                  // TODO: Add Google Places Autocomplete integration
                  // This would typically be done using a library like
                  // @react-google-maps/api or google-maps-react
                  // with proper place selection handling
                />
                <TextField
                  label="Radius (km)"
                  type="number"
                  value={filters.location?.radius || ''}
                  onChange={handleRadiusChange}
                  inputProps={{ min: 1, max: 500 }}
                  sx={{ width: 150 }}
                />
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={handleClearFilters}
                  sx={{ 
                    borderColor: 'divider',
                    color: 'text.secondary',
                    '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
                    px: 3
                  }}
                >
                  Clear Filters
                </Button>
                <Button
                  variant="contained"
                  onClick={handleApplyFilters}
                  color="primary"
                  sx={{ px: 3 }}
                >
                  Apply Filters
                </Button>
              </Box>
              {getActiveFilterCount() > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography 
                    variant="subtitle2" 
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Active Filters:
                  </Typography>
                  <Stack 
                    direction="row" 
                    spacing={1} 
                    flexWrap="wrap" 
                    useFlexGap
                    sx={{ gap: 1 }}
                  >
                    {Object.entries(filters).map(([key, value]) => {
                      if (!value || (Array.isArray(value) && value.length === 0)) return null
                      return (
                        <Chip
                          key={key}
                          label={`${key}: ${Array.isArray(value) ? value.join(', ') : value}`}
                          size="small"
                          color="default"
                          variant="outlined"
                          sx={{
                            borderColor: 'divider',
                            '& .MuiChip-deleteIcon': {
                              color: 'text.secondary',
                              '&:hover': { color: 'error.main' }
                            }
                          }}
                          onDelete={() => { 
                            setFilters(prev => ({
                              ...prev,
                              [key]: Array.isArray(prev[key as keyof TripFilters]) ? [] : undefined
                            }))
                            onFilter(filters)
                          }}
                        />
                      )
                    })}
                  </Stack>
                </Box>
              )}
            </Grid>
          </Grid>
        </LocalizationProvider>
      </Collapse>
    </Paper>
  )
}

export default TripFilters
