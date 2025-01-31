import { Box } from '@mui/material'
import Header from './Header'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
    </Box>
  )
}

export default Layout
