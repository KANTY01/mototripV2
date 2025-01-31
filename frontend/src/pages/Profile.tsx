import { Box } from '@mui/material'
import ProfileHeader from '../components/profile/ProfileHeader'
import ProfileDetails from '../components/profile/ProfileDetails'
import ProfileEdit from '../components/profile/ProfileEdit'
import Achievements from '../components/profile/Achievements'

const Profile = () => {
  return (
    <Box sx={{ p: 3 }}>
      <ProfileHeader />
      <ProfileDetails />
      <Achievements />
      <ProfileEdit />
    </Box>
  )
}

export default Profile
