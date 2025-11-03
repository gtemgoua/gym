export const APP_NAVIGATION = [
  { label: "Dashboard", path: "/dashboard", icon: "dashboard" },
  { label: "Members", path: "/members", icon: "users" },
  { label: "Plans", path: "/plans", icon: "plans" },
  { label: "Classes", path: "/classes", icon: "calendar" },
  { label: "Bookings", path: "/bookings", icon: "booking" },
  { label: "Attendance", path: "/attendance", icon: "check" },
  { label: "Leads", path: "/leads", icon: "lead" },
  { label: "Billing", path: "/billing", icon: "billing" },
  { label: "Reports", path: "/reports", icon: "reports" },
  { label: "Settings", path: "/settings", icon: "settings" }
] as const;

export type AppNavRoute = (typeof APP_NAVIGATION)[number];
