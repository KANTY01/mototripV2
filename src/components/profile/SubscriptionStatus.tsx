import { Box, Typography, Button } from '@mui/material'

interface SubscriptionStatusProps {
  isSubscribed: boolean
  onSubscribe: () => void
  onCancel: () => void
}

const SubscriptionStatus = ({
  isSubscribed,
  onSubscribe,
  onCancel
}: SubscriptionStatusProps) => {
  return (
    <Box sx={{ p: 3, border: '1px solid #ddd', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Subscription Status
      </Typography>
      
      {isSubscribed ? (
        <>
          <Typography sx={{ mb: 2 }}>
            You are currently subscribed to premium features.
          </Typography>
          <Button
            variant="outlined"
            color="error"
            onClick={onCancel}
          >
            Cancel Subscription
          </Button>
        </>
      ) : (
        <>
          <Typography sx={{ mb: 2 }}>
            You are not currently subscribed.
          </Typography>
          <Button
            variant="contained"
            onClick={onSubscribe}
          >
            Subscribe Now
          </Button>
        </>
      )}
    </Box>
  )
}

export default SubscriptionStatus
