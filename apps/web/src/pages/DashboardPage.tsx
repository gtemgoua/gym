import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card } from "@gym/ui";
import { getKpiMetrics, getTodayDashboard } from "../services/api";
import type { ClassEvent } from "../types/dashboard";
import { useAuth } from "../hooks/useAuth";

export const DashboardPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  
  console.log('Dashboard Page State:', {
    user,
    authLoading,
    userRole: user?.role,
    isAuthenticated: !!user
  });

  const { data: today, isError: isTodayError, error: todayError, isLoading: isTodayLoading } = useQuery({ 
    queryKey: ["dashboard", "today"], 
    queryFn: getTodayDashboard,
    retry: 2,
    enabled: !!user && !authLoading,
    staleTime: 30000 // Consider data fresh for 30 seconds
  });
  
  const { data: metrics, isError: isMetricsError, error: metricsError, isLoading: isMetricsLoading } = useQuery({ 
    queryKey: ["dashboard", "metrics"], 
    queryFn: getKpiMetrics,
    retry: 2,
    enabled: !!user && !authLoading,
    staleTime: 30000 // Consider data fresh for 30 seconds
  });

  console.log('Dashboard State:', {
    today,
    metrics,
    isTodayLoading,
    isMetricsLoading,
    isTodayError,
    isMetricsError,
    todayError,
    metricsError,
    queries: {
      enabled: !!user && !authLoading,
      userPresent: !!user,
      authNotLoading: !authLoading
    }
  });

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-r-transparent mx-auto mb-4" />
          <p className="text-gray-600">Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <h2 className="text-lg font-semibold text-yellow-800">Authentication Required</h2>
        <p className="mt-2 text-sm text-yellow-600">Please log in to view the dashboard.</p>
      </div>
    );
  }

  if (isTodayLoading || isMetricsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-r-transparent mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (isTodayError || isMetricsError) {
    console.error('Today error:', todayError);
    console.error('Metrics error:', metricsError);
    
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <h2 className="text-lg font-semibold text-red-800">Error loading dashboard data</h2>
        <p className="mt-2 text-sm text-red-600">
          {todayError instanceof Error ? todayError.message : "Failed to load today's data"}
          {todayError instanceof Error && axios.isAxiosError(todayError) && (
            <span> ({JSON.stringify(todayError.response?.data)})</span>
          )}
        </p>
        <p className="mt-2 text-sm text-red-600">
          {metricsError instanceof Error ? metricsError.message : "Failed to load metrics"}
          {metricsError instanceof Error && axios.isAxiosError(metricsError) && (
            <span> ({JSON.stringify(metricsError.response?.data)})</span>
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card title="Active Members" description="Current count of active member profiles">
          <p className="text-3xl font-semibold">{metrics?.totalMembers ?? "—"}</p>
        </Card>
        <Card title="MRR" description="Monthly recurring revenue">
          <p className="text-3xl font-semibold">${metrics?.mrr ?? "—"}</p>
        </Card>
        <Card title="Churn" description="Last 30 days">
          <p className="text-3xl font-semibold">{metrics?.churnRate ?? "—"}%</p>
        </Card>
        <Card title="LTV" description="Predicted lifetime value">
          <p className="text-3xl font-semibold">${metrics?.ltv ?? "—"}</p>
        </Card>
      </section>

      <Card title="Today" description="Live pulse of the front desk">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Stat label="New signups" value={today?.newSignups} />
          <Stat label="Failed payments" value={today?.failedPayments} />
          <Stat label="Attendance" value={today?.attendanceCount} />
          <Stat label="Occupancy" value={`${today?.occupancy ?? 0}%`} />
        </div>
      </Card>

      <Card title="Upcoming Classes" description="Next five sessions on the calendar">
        <ul className="space-y-3">
          {today?.upcomingClasses?.map((event) => (
            <li key={event.id} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
              <div>
                <p className="text-sm font-medium text-gray-900">{event.template?.name ?? "Class"}</p>
                <p className="text-xs text-gray-500">
                  {new Date(event.startAt).toLocaleString()} • {event.location}
                </p>
              </div>
              <span className="text-sm text-gray-600">
                {event.bookings.length}/{event.capacity} booked
              </span>
            </li>
          ))}
          {today?.upcomingClasses?.length === 0 && <p className="text-sm text-gray-500">No upcoming classes today.</p>}
        </ul>
      </Card>
    </div>
  );
};

const Stat: React.FC<{ label: string; value?: number | string }> = ({ label, value }) => (
  <div className="rounded-lg border border-gray-200 bg-white p-4">
    <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
    <p className="mt-2 text-2xl font-semibold text-gray-900">{value ?? "—"}</p>
  </div>
);
