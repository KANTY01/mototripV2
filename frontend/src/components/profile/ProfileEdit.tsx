import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTheme } from '@mui/material/styles'
import { 
  Box, 
  Button, 
  Typography, 
  TextField,
  Alert,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  styled,
  CircularProgress,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import ImageUpload from '../common/ImageUpload'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { User } from '../../types'
import { ProfileUpdate } from '../../api/users'

interface ProfileFormData {
  username: string
  email: string
  bio?: string
  motorcycle_details?: {
    make?: string
    model?: string
    year?: number
  } | null
  experience_level?: string
  currentPassword?: string
  newPassword?: string
  confirmPassword?: string
}

const schema = yup.object().shape({
  username: yup.string().required('Username is required').min(3, 'Username must be at least 3 characters'),
  experience_level: yup.string(),
  email: yup.string().required('Email is required').email('Invalid email format'),
  bio: yup.string().optional().max(500, 'Bio cannot exceed 500 characters'),
  motorcycle_details: yup.mixed(),
  currentPassword: yup.string().when(['newPassword', 'confirmPassword'], {
    is: (newPassword: string, confirmPassword: string) => newPassword || confirmPassword,
    then: (schema) => schema.required('Current password is required to change password'),
  }),
  newPassword: yup.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: yup.string().oneOf([yup.ref('newPassword')], 'Passwords must match')
})

interface ProfileEditProps {
  initialData: User;
  onSave: (data: ProfileUpdate) => Promise<void>;
  onCancel: () => void;
}

const StyledButton = styled(Button)(({ theme }) => ({
  '&.MuiButton-contained': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}))

const ROUTE_OPTIONS = [
  'Mountain Roads',
  'Coastal Routes',
  'City Streets',
  'Highway',
  'Off-road Trails'
]

const ProfileEdit: React.FC<ProfileEditProps> = ({
  initialData,
  onSave,
  onCancel
}) => {
  const theme = useTheme()
  const [avatarImage, setAvatarImage] = useState<string[]>(
    initialData.avatar ? [initialData.avatar] : []
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [selectedRoutes, setSelectedRoutes] = useState<string[]>([])
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<ProfileFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      username: initialData.username,
      email: initialData.email || '',
      experience_level: initialData.experience_level || '',
      bio: initialData.bio || '',
      motorcycle_details: initialData.motorcycle_details 
        ? typeof initialData.motorcycle_details === 'string'
          ? JSON.parse(initialData.motorcycle_details)
          : initialData.motorcycle_details
        : null
    }
  })

  // Initialize selected routes
  useEffect(() => {
    const routes = Array.isArray(initialData.preferred_routes) 
      ? initialData.preferred_routes.filter((route): route is string => typeof route === 'string') 
      : []
    setSelectedRoutes(routes)
  }, [initialData.preferred_routes])

  const handleAvatarChange = (images: string[]) => {
    setAvatarImage(images)
  }

  const base64ToFile = async (base64String: string): Promise<File> => {
    const response = await fetch(base64String)
    const blob = await response.blob()
    return new File([blob], 'avatar.jpg', { type: 'image/jpeg' })
  }

  const onSubmit = async (data: ProfileFormData) => {
    setLoading(true)
    setError(null)
    try {
      let avatar: File | undefined
      if (avatarImage[0]) {
        avatar = await base64ToFile(avatarImage[0])
      }

      // Only include motorcycle_details if all required fields are present
      let motorcycleDetails = undefined
      if (data.motorcycle_details && 
          data.motorcycle_details.make && 
          data.motorcycle_details.model && 
          data.motorcycle_details.year) {
        motorcycleDetails = {
          make: data.motorcycle_details.make,
          model: data.motorcycle_details.model,
          year: Number(data.motorcycle_details.year)
        }
      }

      await onSave({
        username: data.username,
        email: data.email,
        experience_level: data.experience_level,
        bio: data.bio || undefined,
        preferred_routes: selectedRoutes,
        motorcycle_details: motorcycleDetails,
        avatar: avatar
      })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      if (data.newPassword) {
        setPasswordDialogOpen(false)
        setValue('currentPassword', '')
        setValue('newPassword', '')
        setValue('confirmPassword', '')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = () => {
    setPasswordDialogOpen(true)
  }

  return (
    <>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Profile updated successfully
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Profile Picture
              </Typography>
              <ImageUpload
                images={avatarImage}
                onChange={handleAvatarChange}
                maxImages={1}
                maxSize={Number(import.meta.env.VITE_UPLOAD_MAX_SIZE)}
                allowedTypes={['image/jpeg', 'image/png']}
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Username"
              {...register('username')}
              error={!!errors.username}
              helperText={errors.username?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ width: '100%' }}>
              <Typography 
                component="label" 
                htmlFor="experience-level-select" 
                sx={{ display: 'block', mb: 1 }}
              >
                Experience Level
              </Typography>
              <select
                id="experience-level-select"
                {...register('experience_level')}
                style={{ width: '100%', padding: '8px', fontSize: '1rem' }}
              >
                <option value="">Select Level</option>
                {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="preferred-routes-label">Preferred Routes</InputLabel>
              <Select
                labelId="preferred-routes-label"
                multiple
                value={selectedRoutes}
                onChange={(e) => {
                  const value = e.target.value
                  if (Array.isArray(value) && value.every(v => typeof v === 'string')) {
                    setSelectedRoutes(value as string[])
                  }
                }}
                renderValue={(selected: string[]) => (
                  <Box component="div" sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Typography key={value} component="span">
                        {value}
                      </Typography>
                    ))}
                  </Box>
                )}
              >
                {ROUTE_OPTIONS.map((route) => (
                  <MenuItem key={route} value={route}>
                    {route}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Motorcycle Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Make"
                  {...register('motorcycle_details.make')}
                  error={!!errors.motorcycle_details?.make}
                  helperText={errors.motorcycle_details?.make?.message}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Model"
                  {...register('motorcycle_details.model')}
                  error={!!errors.motorcycle_details?.model}
                  helperText={errors.motorcycle_details?.model?.message}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Year"
                  type="number"
                  {...register('motorcycle_details.year')}
                  error={!!errors.motorcycle_details?.year}
                  helperText={errors.motorcycle_details?.year?.message}
                  InputProps={{
                    inputProps: {
                      min: 1900,
                      max: new Date().getFullYear() + 1
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Bio"
              multiline
              rows={4}
              {...register('bio')}
              error={!!errors.bio}
              helperText={errors.bio?.message}
            />
          </Grid>

          <Grid item xs={12}>
            <Button 
              variant="outlined" 
              onClick={handlePasswordChange}
              sx={{ mr: 2 }}
            >
              Change Password
            </Button>
            
            <Button 
              type="submit" 
              variant="contained"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Update Profile'}
            </Button>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={onCancel} variant="outlined">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading} sx={{ backgroundColor: theme.palette.primary.main }}>
            {loading ? <CircularProgress size={24} /> : 'Save Changes'}
          </Button>
        </Box>
      </Box>

      <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Current Password"
              type="password"
              {...register('currentPassword')}
              error={!!errors.currentPassword}
              helperText={errors.currentPassword?.message}
            />
            
            <TextField
              fullWidth
              label="New Password"
              type="password"
              {...register('newPassword')}
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
            />
            
            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              {...register('confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialogOpen(false)} variant="text">Cancel</Button>
          <Button 
            type="submit" 
            variant="contained"
            disabled={loading}
          >
            Update Password
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ProfileEdit
