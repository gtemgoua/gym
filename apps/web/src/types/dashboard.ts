export interface ClassEvent {
  id: string;
  startAt: string;
  capacity: number;
  location: string;
  template?: {
    name: string;
  };
  bookings: Array<{
    id: string;
  }>;
}

export interface DashboardToday {
  newSignups: number;
  failedPayments: number;
  upcomingClasses: ClassEvent[];
  occupancy: number;
  attendanceCount: number;
}

export interface KpiMetrics {
  mrr: number;
  churnRate: number;
  ltv: number;
  totalMembers: number;
  activeSubscriptions: number;
}