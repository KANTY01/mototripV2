import { Box, Typography, Avatar, Rating, Paper } from '@mui/material'
import { format } from 'date-fns'
import { Review } from '../../types'

interface ReviewCardProps {
  review: Review
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  return (
    <Paper 
      elevation={2}
      sx={{
        mb: 3,
        p: 3,
        borderRadius: 2,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
        <Avatar 
          src={review.user.avatar} 
          sx={{ 
            mr: 2,
            width: 48,
            height: 48,
            border: '2px solid #1976d2'
          }} 
        />
        <Box>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontWeight: 600,
              color: 'primary.main' 
            }}
          >
            {review.user.username}
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              color: 'text.secondary',
              display: 'block',
              mt: 0.5
            }}
          >
            {format(new Date(review.created_at), 'MMM dd, yyyy')}
          </Typography>
        </Box>
      </Box>
      
      <Rating 
        value={review.rating} 
        readOnly 
        precision={0.5}
        sx={{ 
          mb: 2,
          '& .MuiRating-icon': {
            color: 'primary.main'
          }
        }} 
      />
      
      <Typography 
        variant="body1" 
        sx={{ 
          mt: 1,
          mb: 2,
          lineHeight: 1.7,
          color: 'text.primary',
          whiteSpace: 'pre-line'
        }}
      >
        {review.content}
      </Typography>
      
      {review.images && review.images.length > 0 && (
        <Box 
          sx={{ 
            mt: 2,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: 2
          }}
        >
          {review.images.map((image: string, index: number) => (
            <Box
              key={index}
              sx={{
                position: 'relative',
                paddingTop: '100%', // 1:1 Aspect ratio
                overflow: 'hidden',
                borderRadius: 2,
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  '& img': {
                    filter: 'brightness(1.1)'
                  }
                }
              }}
            >
              <Box
                component="img"
                src={image}
                alt={`Review ${index + 1}`}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'filter 0.3s ease'
                }}
              />
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  )
}

export default ReviewCard
