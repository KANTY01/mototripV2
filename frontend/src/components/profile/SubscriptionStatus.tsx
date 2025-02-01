import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { premiumApi } from '../../api/premium';
import { Theme } from '@mui/material/styles';
import {
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Divider,
  Stack,
  styled
} from '@mui/material';
import {
  CreditCard as CreditCardIcon,
  History as HistoryIcon,
  CompareArrows as CompareIcon,
  Autorenew as AutoRenewIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import axiosInstance from '../../api/axiosConfig';
import type { SubscriptionPlan, SubscriptionStatus as SubscriptionStatusType, PaymentMethod } from '../../types/premium';

const api = premiumApi(axiosInstance);

interface UsageStats {
  premiumTripsViewed: number;
  premiumTripsTotal: number;
  premiumContentAccessed: number;
  daysRemaining: number;
}

const SubscriptionStatusComponent: React.FC = () => {
  const theme = useTheme();
  const [status, setStatus] = useState<SubscriptionStatusType | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [plansDialogOpen, setPlansDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [usageStats, setUsageStats] = useState<UsageStats>({
    premiumTripsViewed: 15,
    premiumTripsTotal: status?.plan?.premiumTripsLimit || 50,
    premiumContentAccessed: 25,
    daysRemaining: 45
  });

  useEffect(() => {
    const loadSubscriptionData = async () => {
      try {
        setLoading(true);
        const [statusData, plansData] = await Promise.all([
          api.checkSubscriptionStatus(),
          api.getSubscriptionPlans()
        ]);
        setStatus(statusData);
        setPlans(plansData);
        setError(null);
      } catch (err) {
        setError('Failed to load subscription data');
        console.error('Subscription data error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSubscriptionData();
  }, []);

  const handleAutoRenewToggle = async () => {
    if (!status) return;

    try {
      await api.toggleAutoRenew(!status.autoRenew);
      setStatus((prev: SubscriptionStatusType | null) => prev ? { ...prev, autoRenew: !prev.autoRenew } : null);
    } catch (err) {
      setError('Failed to update auto-renewal settings');
    }
  };

  const handlePlanUpgrade = async (planId: string) => {
    if (!status?.paymentMethod?.id) return;

    try {
      await api.createSubscription(planId, status.paymentMethod.id);
      setPlansDialogOpen(false);
      const newStatus = await api.checkSubscriptionStatus();
      setStatus(newStatus);
    } catch (err) {
      setError('Failed to upgrade plan');
    }
  };

  const handleCancelSubscription = async () => {
    try {
      await api.cancelSubscription();
      const newStatus = await api.checkSubscriptionStatus();
      setStatus(newStatus);
    } catch (err) {
      setError('Failed to cancel subscription');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!status?.isActive) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            No Active Subscription
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Upgrade to Premium to access exclusive features and content.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ backgroundColor: theme.palette.primary.main }}
            onClick={() => setPlansDialogOpen(true)}
          >
            View Premium Plans
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      {/* Current Plan Status */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Current Plan: {status.plan?.name}
                <Chip
                  label="Active"
                  color="success"
                  size="small"
                  sx={{ ml: 1, backgroundColor: theme.palette.success.main }}
                />
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Valid until {new Date(status.endDate || '').toLocaleDateString()}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<CompareIcon />}
              onClick={() => setPlansDialogOpen(true)}
            >
              Compare Plans
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Usage Statistics */}
          <Typography variant="subtitle1" gutterBottom>
            Usage Statistics
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Premium Trips Viewed
                </Typography>
                <Typography variant="h6">
                  {usageStats.premiumTripsViewed} / {usageStats.premiumTripsTotal}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Days Remaining
                </Typography>
                <Typography variant="h6">
                  {usageStats.daysRemaining} days
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Features */}
          <Typography variant="subtitle1" gutterBottom>
            Included Features
          </Typography>
          <Grid container spacing={1}>
            {status.plan?.features.map((feature: string, index: number) => (
              <Grid item xs={12} key={index}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircleIcon sx={{ color: 'success.main', mr: 1, fontSize: 20 }} />
                  <Typography variant="body2">{feature}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Payment & Settings */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Payment & Settings
          </Typography>

          <Stack spacing={2}>
            {/* Payment Method */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CreditCardIcon sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="body1" color="textPrimary">
                    Payment Method
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {status.paymentMethod?.type === 'credit_card'
                      ? `•••• ${status.paymentMethod.last4}`
                      : 'PayPal'}
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setPaymentDialogOpen(true)}
              >
                Update
              </Button>
            </Box>

            {/* Auto Renewal */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AutoRenewIcon sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="body1" color="textPrimary">
                    Auto-renewal
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {status.autoRenew ? 'Enabled' : 'Disabled'}
                  </Typography>
                </Box>
              </Box>
              <Switch
                checked={status.autoRenew}
                onChange={handleAutoRenewToggle}
              />
            </Box>

            {/* Billing History */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <HistoryIcon sx={{ mr: 1 }} />
                <Typography variant="body1" color="textPrimary">
                  Billing History,
                </Typography>
              </Box>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setHistoryDialogOpen(true)}
              >
                View History
              </Button>
            </Box>

            <Divider />

            {/* Cancel Subscription */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                color="error"
                onClick={handleCancelSubscription}
              >
                Cancel Subscription
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Plan Comparison Dialog */}
      <Dialog
        open={plansDialogOpen}
        onClose={() => setPlansDialogOpen(false)}
        PaperProps={{ style: { maxWidth: '80%' } }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Premium Plans</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {plans.map((plan) => (
              <Grid item xs={12} md={4} key={plan.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="textPrimary">
                      {plan.name}
                    </Typography>
                    <Typography variant="h4" gutterBottom>
                      ${plan.price}
                      <Typography variant="caption" color="text.secondary">
                        /{plan.duration} months
                      </Typography>,
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    {plan.features.map((feature: string, index: number) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CheckCircleIcon sx={{ color: 'success.main', mr: 1, fontSize: 20 }} />
                        <Typography variant="body2">{feature}</Typography>
                      </Box>
                    ))},
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={() => handlePlanUpgrade(plan.id)}
                      disabled={status?.plan?.id === plan.id}
                    >
                      {status?.plan?.id === plan.id ? 'Current Plan' : 'Select Plan'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPlansDialogOpen(false)}>Close</Button>
        </DialogActions>,
      </Dialog>

      {/* Billing History Dialog */}
      <Dialog
        open={historyDialogOpen}
        onClose={() => setHistoryDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Billing History</DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* TODO: Replace with actual billing history */}
                <TableRow>
                  <TableCell>2024-01-01</TableCell>
                  <TableCell>Premium Plan - Monthly</TableCell>
                  <TableCell>$19.99</TableCell>
                  <TableCell>
                    <Chip label="Paid" color="success" size="small" />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHistoryDialogOpen(false)}>Close</Button>
        </DialogActions>,
      </Dialog>

      {/* Payment Method Dialog */}
      <Dialog
        open={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
        PaperProps={{ style: { width: '50%' } }}
      >
        <DialogTitle>Update Payment Method</DialogTitle>
        <DialogContent>
          {/* TODO: Implement payment method form */}
          <Typography>Payment method update form will be implemented here.</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between' }}>
          <Button onClick={() => setPaymentDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const StyledPaper = (theme: Theme) => styled(Paper)({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    boxShadow: 'none',
    borderColor: theme.palette.action.hover
  }
});

export default SubscriptionStatusComponent;
