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
  Typography,
  useTheme
} from '@mui/material'
import { FilterList as FilterListIcon } from '@mui/icons-material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'

interface TripFilters {
  difficulty?: string
  minDistance?: number
  maxDistance?: number
  startDate?: Date | null
  endDate?: Date | null
}

interface TripFiltersProps {
  onFilter: (filters: TripFilters) => void
}

const difficulties = ['Easy', 'Moderate', 'Hard', 'Expert']

const TripFilters = ({ onFilter }: TripFiltersProps) => {
  const theme = useTheme()
  const [isExpanded, setIsExpanded] = useState(false)
  const [filters, setFilters] = useState<TripFilters>({
    difficulty: undefined,
    minDistance: undefined,
    maxDistance: undefined,
    startDate: null,
    endDate: null
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

  const handleDateChange = (field: 'startDate' | 'endDate') => (value: Date | null) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleApplyFilters = () => {
    onFilter(filters)
  }

  const handleClearFilters = () => {
    setFilters({
      difficulty: undefined,
      minDistance: undefined,
      maxDistance: undefined,
      startDate: null,
      endDate: null
    })
    onFilter({})
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: isExpanded ? 2 : 0 }}>
        <IconButton onClick={() => setIsExpanded(!isExpanded)} size="small">
          <FilterListIcon />
        </IconButton>
        <Typography variant="h6" sx={{ ml: 1 }}>
          Filters
        </Typography>
      </Box>

      <Collapse in={isExpanded}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={2}>
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

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={handleClearFilters}
                  sx={{ color: theme.palette.grey[600] }}
                >
                  Clear Filters
                </Button>
                <Button
                  variant="contained"
                  onClick={handleApplyFilters}
                  color="primary"
                >
                  Apply Filters
                </Button>
              </Box>
            </Grid>
          </Grid>
        </LocalizationProvider>
      </Collapse>
    </Paper>
  )
}

export default TripFilters
