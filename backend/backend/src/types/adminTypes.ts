export type UserFilters = {
  role?: 'user' | 'admin' | 'moderator';
  status?: 'active' | 'disabled';
  search?: string;
};

export type ModerationAction = 'approve' | 'reject' | 'flag';
export type ModerationResult = {
  tripId: number;
  newStatus: 'active' | 'pending' | 'rejected' | 'completed';
  moderatedAt: Date;
};

export type PlatformAnalytics = {
  totalUsers: number;
  totalTrips: number;
  totalBookings: number;
  activeTrips: number;
  averageSeats: number;
};

export type ReportParams = {
  startDate: Date;
  endDate: Date;
  reportType: 'user_activity' | 'trip_activity';
};

export type ReportResult = {
  generatedAt: Date;
  data: Array<Record<string, unknown>>;
};
