import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ProtectedLayout } from "../components/ProtectedLayout";
import { DashboardPage } from "../pages/DashboardPage";
import { LoginPage } from "../pages/LoginPage";
import { MembersPage } from "../pages/MembersPage";
import { PlansPage } from "../pages/PlansPage";
import { ClassesPage } from "../pages/ClassesPage";
import { BookingsPage } from "../pages/BookingsPage";
import { AttendancePage } from "../pages/AttendancePage";
import { LeadsPage } from "../pages/LeadsPage";
import { BillingPage } from "../pages/BillingPage";
import { ReportsPage } from "../pages/ReportsPage";
import { SettingsPage } from "../pages/SettingsPage";

export const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-r-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/members" element={<MembersPage />} />
        <Route path="/plans" element={<PlansPage />} />
        <Route path="/classes" element={<ClassesPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/leads" element={<LeadsPage />} />
        <Route path="/billing" element={<BillingPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};
