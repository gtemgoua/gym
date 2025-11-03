import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { SidebarNav } from "@gym/ui";
import { APP_NAVIGATION } from "@gym/config";
import { useAuth } from "../hooks/useAuth";

export const ProtectedLayout: React.FC = () => {
  const { user, logout, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-r-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <div className="flex h-screen">
      <SidebarNav routes={APP_NAVIGATION} />
      <div className="flex flex-1 flex-col overflow-y-auto">
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">PulseFit Control Center</h1>
            <p className="text-sm text-gray-500">Welcome back, {user.name}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            Sign out
          </button>
        </header>
        <main className="flex-1 overflow-y-auto bg-slate-50 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
