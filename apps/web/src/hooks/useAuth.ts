import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  // Add debugging info
  const token = localStorage.getItem("auth_token");
  console.log('useAuth hook state:', {
    hasUser: !!context.user,
    userRole: context.user?.role,
    isLoading: context.loading,
    hasToken: !!token,
    tokenPrefix: token?.slice(0, 10),
  });

  return context;
};
