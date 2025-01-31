import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { 
  Box, 
  Button, 
  Typography, 
  TextField, 
  Alert,
  CircularProgress,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import ImageUpload from '../common/ImageUpload'
import { updateProfile } from '../../store/slices/userSlice'
import { AppDispatch } from '../../store/store'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

interface ProfileUpdate {
  username: string
  email: string
  bio?: string
  currentPassword?: string
  newPassword?: string
  confirmPassword?: string
}

const schema = yup.object().shape({
  username: yup.string().required('Username is required').min(3, 'Username must be at least 3 characters'),
  email: yup.string().required('Email is required').email('Invalid email format'),
  bio: yup.string().max(500, 'Bio cannot exceed 500 characters'),
  currentPassword: yup.string().when(['newPassword', 'confirmPassword'], {
    is: (newPassword: string, confirmPassword: string) => newPassword || confirmPassword,
    then: (schema: yup.StringSchema) => schema.required('Current password is required to change password'),
  }),
  newPassword: yup.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: yup.string().oneOf([yup.ref('newPassword')], 'Passwords must match')
})

const ProfileEdit = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [avatarImage, setAvatarImage] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProfileUpdate>({
    resolver: yupResolver(schema),
    defaultValues: {
      username: '',
      email: '',
      bio: ''
    }
  })

  const handleAvatarChange = (images: string[]) => {
    setAvatarImage(images)
  }

  const base64ToFile = async (base64String: string): Promise<File> => {
    const response = await fetch(base64String)
    const blob = await response.blob()
    return new File([blob], 'avatar.jpg', { type: 'image/jpeg' })
  }

  const onSubmit = async (data: ProfileUpdate) => {
    setLoading(true)
    setError(null)
    try {
      let avatar: File | undefined
      if (avatarImage[0]) {
        avatar = await base64ToFile(avatarImage[0])
      }

      await dispatch(updateProfile({
        ...data,
        avatar
      })).unwrap()
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      if (data.newPassword) {
        setPasswordDialogOpen(false)
        reset({ 
          currentPassword: '', 
          newPassword: '', 
          confirmPassword: '' 
        })
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
          <Button onClick={() => setPasswordDialogOpen(false)}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained"
            disabled={loading}
          >
            Update Password
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ProfileEdit
