import { Box, Button, Container, Typography, Paper, IconButton, Avatar, Menu, MenuItem, useTheme } from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store/store'
import { logout } from '../../store/slices/authSlice'
import { UserRole } from '../../types/auth'
import { useState } from 'react'

const Header = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const handleLogout = () => {
    dispatch(logout())
    handleCloseUserMenu()
    navigate('/')
  }

  const publicPages = [
    { title: 'Trips', path: '/trips' },
    { title: 'Feed', path: '/feed' },
    { title: 'Gallery', path: '/gallery' },
    { title: 'Contact', path: '/contact' }
  ]

  const adminPages = [
    { title: 'Dashboard', path: '/admin' },
    { title: 'Analytics', path: '/admin/statistics' },
    { title: 'Manage', path: '/admin/trips' }
  ]

  const premiumPages = [
    { title: 'Premium Content', path: '/premium/content' },
    { title: 'Route Planning', path: '/premium/routes' }
  ]

  const authenticatedPages = [
    { title: 'My Trips', path: '/my-trips' },
    { title: 'Favorites', path: '/favorites' },
    { title: 'Reviews', path: '/my-reviews' }
  ]

  const settings = [
    { title: 'My Profile', action: () => navigate('/profile') },
    { 
      title: 'Edit Profile', 
      action: () => navigate('/profile/edit'),
      roles: ['user', 'premium', 'admin']
    },
    { title: 'Separator', isSeparator: true },
    { title: 'My Trips', action: () => navigate('/trips') },
    { title: 'Logout', action: handleLogout }
  ]

  return (
    <Paper elevation={0} sx={{ 
      position: 'sticky', 
      top: 0, 
      zIndex: 1000,
      borderBottom: `1px solid ${theme.palette.divider}`
    }}>
      <Container maxWidth="xl">
        <Box 
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: 1
          }}
        >
          {/* Logo */}
          <Typography
            variant="h5"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: 'flex',
              alignItems: 'center',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              color: 'inherit',
              textDecoration: 'none',
              '& svg': {
                ml: 1
              }
            }}
          >
            MotoTrips 🏍️
          </Typography>

          {/* Navigation Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            {publicPages.map((page) => (
              <Button
                key={page.title}
                component={RouterLink}
                to={page.path}
                sx={{
                  color: 'text.primary',
                  px: 2,
                  '&:hover': { backgroundColor: theme.palette.action.hover }
                }}
              >
                {page.title}
              </Button>
            ))}

            {isAuthenticated && authenticatedPages.length > 0 && (
              <Box sx={{ ml: 2, pl: 2, borderLeft: `1px solid ${theme.palette.divider}` }}>
                {authenticatedPages.map((page) => (
                  <Button
                    key={page.title}
                    component={RouterLink}
                    to={page.path}
                    sx={{
                      color: 'text.primary',
                      px: 2,
                      '&:hover': { backgroundColor: theme.palette.action.hover }
                    }}
                  >
                    {page.title}
                  </Button>
                ))}
              </Box>
            )}

            {user?.role === 'premium' && premiumPages.length > 0 && (
              <Box sx={{ ml: 2, pl: 2, borderLeft: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>Premium</Typography>
                {premiumPages.map((page) => (
                  <Button
                    key={page.title}
                    component={RouterLink}
                    to={page.path}
                    sx={{
                      color: 'text.primary',
                      px: 2,
                      '&:hover': { backgroundColor: theme.palette.action.hover }
                    }}
                  >
                    {page.title}
                  </Button>
                ))}
              </Box>
            )}

            {user?.role === 'admin' && adminPages.length > 0 && (
              <Box sx={{ ml: 2, pl: 2, borderLeft: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>Admin</Typography>
                {adminPages.map((page) => (
                  <Button
                    key={page.title}
                    component={RouterLink}
                    to={page.path}
                    sx={{
                      color: 'text.primary',
                      px: 2,
                      '&:hover': { backgroundColor: theme.palette.action.hover }
                    }}
                  >
                    {page.title}
                  </Button>
                ))}
              </Box>
            )}
          </Box>

          {/* User Menu */}
          <Box sx={{ flexShrink: 0 }}>
            {isAuthenticated ? (
              <>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar 
                    alt={user?.username} 
                    src={user?.avatar}
                    sx={{
                      width: 40, 
                      height: 40,
                      bgcolor: user?.avatar ? 'transparent' : theme.palette.primary.main
                    }}
                  >
                    {user?.username?.[0]?.toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  PaperProps={{
                    sx: {
                      mt: 2,
                      borderRadius: 0,
                      border: `1px solid ${theme.palette.divider}`,
                      backgroundColor: theme.palette.background.paper
                    }
                  }}
                >
                  {settings.map((setting, index) => {
                    if (setting.isSeparator) {
                      return <hr key={`separator-${index}`} style={{ margin: '4px 0', border: '0', borderTop: `1px solid ${theme.palette.divider}` }} />
                    }

                    if (setting.roles && user?.role && !setting.roles.includes(user.role)) {
                      return null
                    }

                    return (
                      <MenuItem 
                        key={setting.title} 
                        onClick={() => {
                          setting.action?.()
                          handleCloseUserMenu()
                        }}
                      >
                        <Typography textAlign="center">{setting.title}</Typography>
                      </MenuItem>
                    )
                  })}
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 0,
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                      borderColor: theme.palette.primary.light
                    }
                  }}
                >
                  Login
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 0,
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark
                    }
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Paper>
  )
}

export default Header
