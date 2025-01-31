import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { RootState } from '../../store/store'
import { premiumApi } from '../../api/premium'

interface PremiumContentProps {
  tripId: number
  isPremium: boolean
}

const PremiumContent = ({ tripId, isPremium }: PremiumContentProps) => {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      try {
        const response = await premiumApi.checkSubscriptionStatus()
        setIsSubscribed(response.isPremium)
      } catch (error) {
        console.error('Failed to check subscription status:', error)
      }
    }

    if (isAuthenticated) {
      checkSubscriptionStatus()
    }
  }, [isAuthenticated])

  const handleSubscribe = () => {
    setShowDialog(true)
  }

  const handleCloseDialog = () => {
    setShowDialog(false)
  }

  const handleConfirmSubscription = async () => {
    try {
      await premiumApi.createSubscription()
      setIsSubscribed(true)
      setShowDialog(false)
    } catch (error) {
      console.error('Failed to create subscription:', error)
    }
  }

  if (!isPremium) {
    return null
  }

  if (isSubscribed) {
    return (
      <Box sx={{ p: 3, border: '1px solid #ddd', borderRadius: 2, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Premium Content
        </Typography>
        <Typography>
          This is exclusive premium content available to subscribed users.
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3, border: '1px solid #ddd', borderRadius: 2, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Premium Content
      </Typography>
      <Typography sx={{ mb: 2 }}>
        This content is available to subscribed users only.
      </Typography>
      <Button variant="contained" onClick={handleSubscribe}>
        Subscribe Now
      </Button>

      <Dialog open={showDialog} onClose={handleCloseDialog}>
        <DialogTitle>Subscribe to Premium Content</DialogTitle>
        <DialogContent>
          <Typography>
            Confirm your subscription to access premium content.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirmSubscription} variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default PremiumContent
