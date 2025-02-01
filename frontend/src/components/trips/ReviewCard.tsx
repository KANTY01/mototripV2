import { useState } from 'react';
import { 
  useTheme,
  Box, 
  Typography, 
  Avatar, 
  Rating, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  Chip,
  List,
  ListItem,
  styled,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@mui/material';
import {
  MoreVert,
  ThumbUp,
  ThumbDown,
  Report,
  Edit,
  Delete
} from '@mui/icons-material';
import { format } from 'date-fns';
import { Review } from '../../types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { deleteReview, voteReview, reportReview } from '../../store/slices/reviewSlice';
import { RootState } from '../../store/store';

interface ReviewCardProps {
  review: Review;
  onEdit?: () => void;
  isOwner?: boolean;
  isAdmin?: boolean;
}

const ReviewCard = ({ review, onEdit, isOwner = false, isAdmin = false }: ReviewCardProps) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const status = useAppSelector((state: RootState) => state.reviews.status);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleVote = (type: 'up' | 'down') => {
    dispatch(voteReview({ reviewId: review.id, voteType: type }));
  };

  const handleReport = () => {
    setShowReportDialog(true);
    handleMenuClose();
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
    handleMenuClose();
  };

  const confirmReport = () => {
    dispatch(reportReview({ reviewId: review.id, reason: reportReason }));
    setShowReportDialog(false);
    setReportReason('');
  };

  const confirmDelete = () => {
    dispatch(deleteReview(review.id));
    setShowDeleteDialog(false);
  };

  const handleEdit = () => {
    onEdit?.();
    handleMenuClose();
  };

  return (
    <Paper 
      elevation={0}
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 1,
        border: `1px solid ${theme.palette.divider}`,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5, justifyContent: 'space-between' }}>
        <Avatar 
          src={review.user?.avatar || '/default-avatar.png'} 
          sx={{ 
            mr: 2,
            width: 48,
            height: 48,
            border: `2px solid ${theme.palette.primary.main}`
          }}  
        />
        <Box>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontWeight: 600,
              color: theme.palette.primary.main 
            }}
          >
            {review.user?.username || 'Unknown User'}
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              color: theme.palette.text.secondary,
              display: 'block',
              mt: 0.5
            }}
          >
            {format(new Date(review.created_at), 'MMM dd, yyyy')}
          </Typography>
        </Box>

        <Box>
          <IconButton
            aria-label="More options"
            onClick={handleMenuOpen}
            sx={{ ml: 1 }}
          >
            <MoreVert />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            {(isOwner || isAdmin) && [
              <MenuItem key="edit" onClick={handleEdit} disabled={status === 'loading'}>
                <Edit sx={{ mr: 1 }} /> Edit
              </MenuItem>,
              <MenuItem key="delete" onClick={handleDelete} disabled={status === 'loading'}>
                <Delete sx={{ mr: 1, color: theme.palette.error.main }} /> Delete
              </MenuItem>
            ]}
            {!isOwner && [
              <MenuItem key="report" onClick={handleReport} disabled={status === 'loading'}>
                <Report sx={{ mr: 1, color: theme.palette.warning.main }} /> Report
              </MenuItem>
            ]}
          </Menu>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Tooltip title="Upvote">
          <IconButton 
            onClick={() => handleVote('up')}
            disabled={status === 'loading'}
            sx={{ 
              color: review.votes?.user_vote === 'up' ? theme.palette.primary.main : theme.palette.text.secondary,
              '&:hover': { color: theme.palette.primary.main }
            }}
          >
            <ThumbUp />
            <Typography variant="body2" sx={{ ml: 0.5 }}>
              {review.votes?.upvotes ?? 0}
            </Typography>
          </IconButton>
        </Tooltip>

        <Tooltip title="Downvote">
          <IconButton 
            onClick={() => handleVote('down')}
            disabled={status === 'loading'}
            sx={{ 
              color: review.votes?.user_vote === 'down' ? theme.palette.error.main : theme.palette.text.secondary,
              '&:hover': { color: theme.palette.error.main }
            }}
          >
            <ThumbDown />
            <Typography variant="body2" sx={{ ml: 0.5 }}>
              {review.votes?.downvotes ?? 0}
            </Typography>
          </IconButton>
        </Tooltip>
      </Box>
      
      <Rating 
        value={review.rating} 
        readOnly 
        precision={0.5}
        sx={{ 
          mb: 2,
          '& .MuiRating-icon': {
            color: theme.palette.primary.main
          }
        }} 
      />

      <Typography 
        variant="body1" 
        sx={{ 
          mt: 1,
          mb: 2,
          lineHeight: 1.7,
          color: theme.palette.text.primary,
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
                borderRadius: 1,
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

      {/* Report Dialog */}
      <Dialog open={showReportDialog} onClose={() => setShowReportDialog(false)}>
        <DialogTitle>Report Review</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Reason for reporting"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={reportReason}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReportReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowReportDialog(false)}>Cancel</Button>
          <Button 
            onClick={confirmReport}
            color="warning"
            disabled={!reportReason.trim() || status === 'loading'}
          >
            Report
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <DialogTitle>Delete Review</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this review?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
          <Button 
            onClick={confirmDelete}
            color="error"
            disabled={status === 'loading'}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ReviewCard;
