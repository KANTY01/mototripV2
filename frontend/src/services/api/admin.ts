import { api } from '.';

export interface Trip {
  id: number;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  price: number;
  capacity: number;
  status: 'pending' | 'active' | 'rejected' | 'completed';
  createdAt: string;
  organizer: {
    id: number;
    username: string;
  };
}

export interface SystemSettings {
  require_admin_approval: boolean;
  max_login_attempts: number;
  password_expiry_days: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

export interface AdminLog {
  id: number;
  action: string;
  details: string;
  timestamp: string;
}

export const adminApi = {
  async getAllUsers(): Promise<User[]> {
    const response = await api.get('/admin/users');
    return response.data;
  },

  async getLogs(): Promise<{ data: AdminLog[] }> {
    const response = await api.get('/admin/logs');
    return response.data;
  },

  async getSettings(): Promise<{ settings: SystemSettings }> {
    const response = await api.get('/admin/settings');
    return response.data;
  },

  async getStatistics(): Promise<{
    totalUsers: number;
    activeUsers: number;
    pendingUsers: number;
    totalMeetings: number;
  }> {
    const response = await api.get('/admin/statistics');
    return response.data;
  },

  async getMeetings(): Promise<Trip[]> {
    const response = await api.get('/admin/meetings');
    return response.data;
  },

  async updateSettings(settings: SystemSettings): Promise<void> {
    await api.put('/admin/settings', settings);
  },

  async activateUser(userId: number): Promise<void> {
    await api.put(`/admin/users/${userId}/activate`);
  },

  // Trip management endpoints
  async getAllTrips(): Promise<Trip[]> {
    const response = await api.get('/admin/trips');
    return response.data;
  },

  async updateTripStatus(tripId: number, status: Trip['status']): Promise<void> {
    await api.put(`/admin/trips/${tripId}/status`, { status });
  },

  async getTripDetails(tripId: number): Promise<Trip> {
    const response = await api.get(`/admin/trips/${tripId}`);
    return response.data;
  },

  async deleteTrip(tripId: number): Promise<void> {
    await api.delete(`/admin/trips/${tripId}`);
  }
};
