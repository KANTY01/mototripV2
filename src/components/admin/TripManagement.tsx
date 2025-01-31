import { useState } from 'react'
import { 
  Box, 
  Button, 
  Typography, 
  Paper,
  IconButton,
  Tooltip,
  Alert,
  useTheme
} from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material'
import { format } from 'date-fns'
import { 
  useGetTripsQuery, 
  useCreateTripMutation,
  useUpdateTripMutation,
  useDeleteTripsMutation
} from '../../api/admin'
import TripForm from './TripForm'
import { Trip } from '../../types'

const TripManagement = () => {
  const theme = useTheme()
  const [selectedTrips, setSelectedTrips] = useState<number[]>([])
  const [formOpen, setFormOpen] = useState(false)
  const [editingTrip, setEditingTrip] = useState<Trip | undefined>(undefined)
  const [error, setError] = useState<string | null>(null)

  const { data: trips = [], isLoading, refetch } = useGetTripsQuery({})
  const [createTrip] = useCreateTripMutation()
  const [updateTrip] = useUpdateTripMutation()
  const [deleteTrips] = useDeleteTripsMutation()

  const handleCreate = async (tripData: Omit<Trip, 'id'>) => {
    try {
      await createTrip(tripData).unwrap()
      setFormOpen(false)
      refetch()
    } catch (err) {
      setError('Failed to create trip')
    }
  }

  const handleUpdate = async (tripData: Partial<Trip> & { id: number }) => {
    try {
      await updateTrip(tripData).unwrap()
      setFormOpen(false)
      setEditingTrip(undefined)
      refetch()
    } catch (err) {
      setError('Failed to update trip')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteTrips(selectedTrips).unwrap()
      setSelectedTrips([])
      refetch()
    } catch (err) {
      setError('Failed to delete trips')
    }
  }

  const columns: GridColDef[] = [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 90 
    },
    { 
      field: 'title', 
      headerName: 'Title', 
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Typography sx={{ fontWeight: 500 }}>
          {params.value}
        </Typography>
      )
    },
    { 
      field: 'user', 
      headerName: 'Author', 
      width: 150,
      valueGetter: (params) => params.row.user?.username || 'Unknown'
    },
    { 
      field: 'created_at', 
      headerName: 'Created', 
      width: 150,
      valueFormatter: (params) => 
        format(new Date(params.value), 'MMM dd, yyyy')
    },
    { 
      field: 'difficulty', 
      headerName: 'Difficulty', 
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Typography
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 500
          }}
        >
          {params.value}
        </Typography>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Tooltip title="Edit Trip">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                setEditingTrip(params.row as Trip)
                setFormOpen(true)
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  return (
    <Paper 
      sx={{ 
        height: 600, 
        width: '100%',
        p: 3,
        borderRadius: 2
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 600,
            color: 'primary.main',
            mb: 2
          }}
        >
          Trip Management
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingTrip(undefined)
              setFormOpen(true)
            }}
            sx={{
              borderRadius: 2,
              textTransform: 'none'
            }}
          >
            Create Trip
          </Button>
          
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            disabled={selectedTrips.length === 0}
            onClick={handleDelete}
            sx={{
              borderRadius: 2,
              textTransform: 'none'
            }}
          >
            Delete Selected ({selectedTrips.length})
          </Button>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            onClose={() => setError(null)}
            sx={{ mt: 2 }}
          >
            {error}
          </Alert>
        )}
      </Box>

      <DataGrid
        rows={trips}
        columns={columns}
        loading={isLoading}
        checkboxSelection
        disableRowSelectionOnClick
        onRowSelectionModelChange={(ids) => setSelectedTrips(ids as number[])}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        sx={{
          '& .MuiDataGrid-cell': {
            borderColor: theme.palette.divider
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: theme.palette.action.hover,
            borderRadius: 1
          }
        }}
      />

      <TripForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setEditingTrip(undefined)
        }}
        onSubmit={editingTrip ? handleUpdate : handleCreate}
        initialData={editingTrip}
        mode={editingTrip ? 'edit' : 'create'}
      />
    </Paper>
  )
}

export default TripManagement
