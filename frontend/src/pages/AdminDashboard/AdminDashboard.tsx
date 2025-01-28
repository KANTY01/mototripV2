import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Switch,
  TextField,
  Button,
  CircularProgress,
  TablePagination,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../../hooks/useAuth";
import {
  adminApi,
  User,
  AdminLog,
  SystemSettings,
  Trip,
} from "../../services/api/admin";

// Use Trip type for meetings since they're the same entity
type Meeting = Trip;

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  // Global states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Section-specific loading and error states
  const [sectionStates, setSectionStates] = useState({
    users: { loading: false, error: null as string | null },
    meetings: { loading: false, error: null as string | null },
    logs: { loading: false, error: null as string | null },
    trips: { loading: false, error: null as string | null },
    settings: { loading: false, error: null as string | null },
  });

  // Data states
  const [users, setUsers] = useState<User[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [settings, setSettings] = useState<SystemSettings>({
    require_admin_approval: true,
    max_login_attempts: 5,
    password_expiry_days: 90,
  });

  const [trips, setTrips] = useState<Trip[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingUsers: 0,
    totalMeetings: 0,
  });

  // Helper function to update section state
  const updateSectionState = (
    section: keyof typeof sectionStates,
    updates: Partial<typeof sectionStates[keyof typeof sectionStates]>
  ) => {
    setSectionStates(prev => ({
      ...prev,
      [section]: { ...prev[section], ...updates }
    }));
  };

  // Helper function to fetch data with retries
  const fetchWithRetry = async <T,>(
    section: keyof typeof sectionStates,
    fetchFn: () => Promise<T>,
    errorMessage: string,
    maxRetries = 3
  ): Promise<T | null> => {
    let retries = 0;
    while (retries < maxRetries) {
      try {
        updateSectionState(section, { loading: true, error: null });
        const result = await fetchFn();
        updateSectionState(section, { loading: false });
        return result;
      } catch (err) {
        retries++;
        if (retries === maxRetries) {
          const error = `${errorMessage} (Attempt ${retries}/${maxRetries})`;
          updateSectionState(section, { loading: false, error });
          console.error(`${section} error:`, err);
          return null;
        }
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
      }
    }
    return null;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch data for each section independently
        const [
          usersData,
          logsData,
          settingsData,
          statsData,
          meetingsData,
          tripsData
        ] = await Promise.all([
          fetchWithRetry('users', adminApi.getAllUsers, 'Failed to load users'),
          fetchWithRetry('logs', adminApi.getLogs, 'Failed to load logs'),
          fetchWithRetry('settings', adminApi.getSettings, 'Failed to load settings'),
          fetchWithRetry('settings', adminApi.getStatistics, 'Failed to load statistics'),
          fetchWithRetry('meetings', adminApi.getMeetings, 'Failed to load meetings'),
          fetchWithRetry('trips', adminApi.getAllTrips, 'Failed to load trips'),
        ]);

        // Update states only for successfully fetched data
        if (usersData) setUsers(usersData);
        if (logsData) setLogs(logsData.data);
        if (settingsData) setSettings(settingsData.settings);
        if (statsData) setStats(statsData);
        if (meetingsData) setMeetings(meetingsData);
        if (tripsData) setTrips(tripsData);

      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSettingChange = (setting: keyof typeof settings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handleSettingSave = async () => {
    try {
      updateSectionState('settings', { loading: true, error: null });
      await adminApi.updateSettings(settings);
      setSuccess("Settings updated successfully");
    } catch (err) {
      const apiError = err as { message?: string };
      const errorMessage = apiError.message || "Failed to update settings";
      updateSectionState('settings', { error: errorMessage });
    } finally {
      updateSectionState('settings', { loading: false });
    }
  };

  const handleUserActivation = async (userId: number, isActive: boolean) => {
    try {
      updateSectionState('users', { loading: true, error: null });
      await adminApi.activateUser(userId);
      setUsers(users.map((u) => (u.id === userId ? { ...u, isActive } : u)));
      setSuccess("User status updated successfully");
    } catch (err) {
      const apiError = err as { message?: string };
      const errorMessage = apiError.message || "Failed to update user status";
      updateSectionState('users', { error: errorMessage });
    } finally {
      updateSectionState('users', { loading: false });
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Welcome back, {user?.username}
      </Typography>

      {/* Global error */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        sx={{ mb: 2 }}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>

      {/* Section-specific errors */}
      {Object.entries(sectionStates).map(([section, state]) => (
        state.error && (
          <Alert
            key={section}
            severity="error"
            sx={{ mb: 2 }}
            onClose={() => updateSectionState(section as keyof typeof sectionStates, { error: null })}
          >
            {state.error}
          </Alert>
        )
      ))}
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
        sx={{ mb: 2 }}
      >
        <Alert
          onClose={() => setSuccess(null)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {success}
        </Alert>
      </Snackbar>

      <Grid container spacing={3}>
        {/* Statistics Overview */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              System Overview
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Typography variant="h4">{stats.totalUsers}</Typography>
                <Typography color="textSecondary">Total Users</Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="h4">{stats.activeUsers}</Typography>
                <Typography color="textSecondary">Active Users</Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="h4">{stats.pendingUsers}</Typography>
                <Typography color="textSecondary">Pending Users</Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="h4">{stats.totalMeetings}</Typography>
                <Typography color="textSecondary">Total Meetings</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Trip Management Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Trip Management
              </Typography>
              {sectionStates.trips.loading && (
                <CircularProgress size={24} />
              )}
            </Box>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Dates</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Capacity</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {trips.map((trip) => (
                  <TableRow key={trip.id}>
                    <TableCell>
                      <Typography variant="body1">
                        {trip.title}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {trip.description.substring(0, 100)}...
                      </Typography>
                    </TableCell>
                    <TableCell>{trip.location}</TableCell>
                    <TableCell>
                      {new Date(trip.startDate).toLocaleDateString()} - 
                      {new Date(trip.endDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>${trip.price}</TableCell>
                    <TableCell>{trip.capacity}</TableCell>
                    <TableCell>
                      <Select
                        value={trip.status}
                        onChange={async (e) => {
                          try {
                            await adminApi.updateTripStatus(trip.id, e.target.value as Trip['status']);
                            setTrips(trips.map(t => 
                              t.id === trip.id ? { ...t, status: e.target.value as Trip['status'] } : t
                            ));
                            setSuccess("Trip status updated successfully");
                          } catch (err) {
                            setError("Failed to update trip status");
                          }
                        }}
                        size="small"
                      >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="rejected">Rejected</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={async () => {
                          if (window.confirm("Are you sure you want to delete this trip?")) {
                            try {
                              await adminApi.deleteTrip(trip.id);
                              setTrips(trips.filter(t => t.id !== trip.id));
                              setSuccess("Trip deleted successfully");
                            } catch (err) {
                              setError("Failed to delete trip");
                            }
                          }
                        }}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>

        {/* Meetings Management Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Meetings Management
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Organizer</TableCell>
                  <TableCell>Created At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {meetings.map((meeting) => (
                  <TableRow key={meeting.id}>
                    <TableCell>
                      <Typography variant="body1">
                        {meeting.title}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {meeting.description.substring(0, 100)}...
                      </Typography>
                    </TableCell>
                    <TableCell>{meeting.location}</TableCell>
                    <TableCell>
                      {new Date(meeting.startDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{meeting.organizer.username}</TableCell>
                    <TableCell>
                      {new Date(meeting.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>

        {/* User Management Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                User Management
              </Typography>
              {sectionStates.users.loading && (
                <CircularProgress size={24} />
              )}
            </Box>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Switch
                        checked={user.isActive}
                        onChange={() =>
                          handleUserActivation(user.id, !user.isActive)
                        }
                        color="primary"
                      />
                    </TableCell>
                    <TableCell>{user.createdAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>

        {/* System Settings Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                System Settings
              </Typography>
              {sectionStates.settings.loading && (
                <CircularProgress size={24} />
              )}
            </Box>
            <Box sx={{ p: 2 }}>
              <Box sx={{ mb: 2 }}>
                <Typography>Require Admin Approval</Typography>
                <Switch
                  checked={settings.require_admin_approval}
                  onChange={(e) =>
                    handleSettingChange(
                      "require_admin_approval",
                      e.target.checked
                    )
                  }
                  color="primary"
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography>Max Login Attempts</Typography>
                <TextField
                  type="number"
                  value={settings.max_login_attempts}
                  onChange={(e) =>
                    handleSettingChange(
                      "max_login_attempts",
                      parseInt(e.target.value)
                    )
                  }
                  variant="outlined"
                  size="small"
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography>Password Expiry (days)</Typography>
                <TextField
                  type="number"
                  value={settings.password_expiry_days}
                  onChange={(e) =>
                    handleSettingChange(
                      "password_expiry_days",
                      parseInt(e.target.value)
                    )
                  }
                  variant="outlined"
                  size="small"
                />
              </Box>
              <Box sx={{ mt: 3 }}>
                <Button variant="contained" onClick={handleSettingSave}>
                  Save Settings
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Admin Logs Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity Logs
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Action</TableCell>
                  <TableCell>Details</TableCell>
                  <TableCell>Timestamp</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{log.details}</TableCell>
                    <TableCell>{log.timestamp}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={logs.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
