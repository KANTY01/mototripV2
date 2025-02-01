import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Paper,
  CircularProgress,
  useTheme,
  Button,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  DirectionsBike,
  Star,
  Group,
  TrendingUp,
  AttachMoney,
  AccessTime,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  DateRange as DateRangeIcon
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { adminApi, AdminStats, DateRangeFilter } from '../../api/admin';
import { format, subMonths } from 'date-fns';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Statistics: React.FC = () => {
  const theme = useTheme();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRangeFilter>({
    startDate: format(subMonths(new Date(), 6), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  });
  const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    fetchStatistics();
  }, [dateRange]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getStatistics(dateRange);
      setStats(data);
      setError(null);
    } catch (err) {
      setError('Failed to load statistics');
      console.error('Statistics error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      const blob = await adminApi.exportStatistics(format, dateRange);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `statistics-${format === 'csv' ? 'data.csv' : 'report.pdf'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to export statistics');
    }
    setExportAnchorEl(null);
  };

  const statCards = stats ? [
    {
      title: 'Total Trips',
      value: stats.totalTrips,
      icon: <DirectionsBike />,
      color: theme.palette.primary.main
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <Group />,
      color: theme.palette.secondary.main
    },
    {
      title: 'Premium Users',
      value: stats.premiumUsers,
      icon: <Star />,
      color: theme.palette.warning.main
    },
    {
      title: 'Average Rating',
      value: stats.averageRating.toFixed(1),
      icon: <Star />,
      color: theme.palette.success.main
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      icon: <AttachMoney />,
      color: theme.palette.error.main
    },
    {
      title: 'Premium Conversion',
      value: `${(stats.engagementStats.premiumConversionRate * 100).toFixed(1)}%`,
      icon: <TrendingUp />,
      color: theme.palette.info.main
    }
  ] : [];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !stats) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Alert severity="error">{error || 'Statistics not available'}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Stack direction="row" spacing={2}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start Date"
              value={new Date(dateRange.startDate)}
              onChange={(date) => date && setDateRange(prev => ({
                ...prev,
                startDate: format(date, 'yyyy-MM-dd')
              }))}
              slotProps={{ 
                textField: { 
                  size: 'small',
                  sx: { backgroundColor: 'background.paper' }
                }
              }}
              sx={{ width: 150 }}
            />
            <DatePicker
              label="End Date"
              value={new Date(dateRange.endDate)}
              onChange={(date) => date && setDateRange(prev => ({
                ...prev,
                endDate: format(date, 'yyyy-MM-dd')
              }))}
              slotProps={{ 
                textField: { 
                  size: 'small',
                  sx: { backgroundColor: 'background.paper' }
                }
              }}
              sx={{ width: 150 }}
            />
          </LocalizationProvider>
          <Tooltip title="Refresh Statistics">
            <IconButton 
              onClick={fetchStatistics}
              sx={{ backgroundColor: 'background.paper' }}
            >
            <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            startIcon={<DownloadIcon />}
            variant="outlined"
            size="small"
            onClick={(e) => setExportAnchorEl(e.currentTarget)}
          >
            Export
          </Button>
        </Stack>
      </Box>

      <Menu
        anchorEl={exportAnchorEl}
        open={Boolean(exportAnchorEl)}
        onClose={() => setExportAnchorEl(null)}
      >
        <MenuItem onClick={() => handleExport('csv')}>Export as CSV</MenuItem>
        <MenuItem onClick={() => handleExport('pdf')}>Export as PDF</MenuItem>
      </Menu>

      <Grid container spacing={2}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
            <Card 
              elevation={0}
              sx={{ 
                height: '100%',
                border: 1,
                borderColor: 'divider'
              }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ 
                    backgroundColor: stat.color + '20', 
                    borderRadius: '50%',
                    p: 1,
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {React.cloneElement(stat.icon as React.ReactElement, { 
                      sx: { color: stat.color } 
                    })}
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                    <Typography variant="h6">
                      {stat.value}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* User Growth Chart */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3,
              border: 1,
              borderColor: 'divider'
            }}
          >
            <Typography variant="h6" gutterBottom>
              User Growth
            </Typography>
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={stats.userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="total" name="Total Users" stroke={theme.palette.primary.main} />
                  <Line type="monotone" dataKey="premium" name="Premium Users" stroke={theme.palette.secondary.main} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Revenue Chart */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3,
              border: 1,
              borderColor: 'divider'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Revenue Trends
            </Typography>
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={stats.revenueStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="amount" name="Revenue" fill={theme.palette.success.main} />
                  <Bar dataKey="subscriptions" name="New Subscriptions" fill={theme.palette.info.main} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Trip Distribution */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3,
              border: 1,
              borderColor: 'divider'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Trip Distribution by Difficulty
            </Typography>
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={Object.entries(stats.tripStats.byDifficulty).map(([name, value]) => ({
                      name,
                      value
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {Object.entries(stats.tripStats.byDifficulty).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Engagement Metrics */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3,
              border: 1,
              borderColor: 'divider'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Engagement Metrics
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Average Reviews per Trip
                </Typography>
                <Typography variant="h6">
                  {stats.engagementStats.averageReviewsPerTrip.toFixed(1)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Average Trips per User
                </Typography>
                <Typography variant="h6">
                  {stats.engagementStats.averageTripsPerUser.toFixed(1)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Active Users (Last 30 Days)
                </Typography>
                <Typography variant="h6">
                  {stats.engagementStats.activeUsers.toLocaleString()}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Statistics;
