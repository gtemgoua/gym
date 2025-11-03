import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use((response) => response);

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "OWNER" | "MANAGER" | "STAFF" | "MEMBER";
  };
}

export const login = async (email: string, password: string) => {
  const response = await api.post<LoginResponse>("/auth/login", { email, password });
  return response.data;
};

export const fetchCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const listMembers = async () => {
  const response = await api.get("/members");
  return response.data;
};

export const listPlans = async () => {
  const response = await api.get("/plans");
  return response.data;
};

import type { DashboardToday, KpiMetrics } from "../types/dashboard";

export const getTodayDashboard = async (): Promise<DashboardToday> => {
  const response = await api.get<DashboardToday>("/analytics/dashboard/today");
  return response.data;
};

export const getKpiMetrics = async (): Promise<KpiMetrics> => {
  const response = await api.get<KpiMetrics>("/analytics/metrics");
  return response.data;
};

export const listClassEvents = async () => {
  const response = await api.get("/classes", {
    params: {
      from: new Date().toISOString(),
      to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  });
  return response.data;
};

export const listBookingsApi = async () => {
  const response = await api.get("/bookings");
  return response.data;
};

export const listAttendanceApi = async () => {
  const response = await api.get("/attendance");
  return response.data;
};

export const listLeadsApi = async () => {
  const response = await api.get("/leads");
  return response.data;
};

export const listInvoicesApi = async () => {
  const response = await api.get("/billing/invoices");
  return response.data;
};
