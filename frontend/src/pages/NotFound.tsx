import { Box, Button, Container, Typography, Paper, useTheme } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

const NotFound = () => {
  const theme = useTheme()

  return (
    <Container maxWidth="sm">
      <Paper 
        elevation={0}
        sx={{
          p: 6,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 64px)', // Subtract header height
          gap: 4,
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper
        }}
      >
        <Typography 
          variant="h1" 
          component="h1"
          sx={{ 
            fontWeight: 700,
            color: theme.palette.error.main,
            mb: 2
          }}
        >
          404
        </Typography>
        <Typography 
          variant="h5" 
          component="h2"
          sx={{ 
            fontWeight: 600,
            mb: 2
          }}
        >
          Page Not Found
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary" 
          paragraph
        >
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            component={RouterLink}
            to="/"
            variant="contained"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 1,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Back to Home
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}

export default NotFound
