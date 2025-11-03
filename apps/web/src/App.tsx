import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedLayout } from "./components/ProtectedLayout";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { MembersPage } from "./pages/MembersPage";
import { PlansPage } from "./pages/PlansPage";
import { ClassesPage } from "./pages/ClassesPage";
import { BookingsPage } from "./pages/BookingsPage";
import { AttendancePage } from "./pages/AttendancePage";
import { LeadsPage } from "./pages/LeadsPage";
import { BillingPage } from "./pages/BillingPage";
import { ReportsPage } from "./pages/ReportsPage";
import { SettingsPage } from "./pages/SettingsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="members" element={<MembersPage />} />
        <Route path="plans" element={<PlansPage />} />
        <Route path="classes" element={<ClassesPage />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="leads" element={<LeadsPage />} />
        <Route path="billing" element={<BillingPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
