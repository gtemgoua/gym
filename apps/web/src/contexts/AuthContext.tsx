import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { api, fetchCurrentUser, login as loginRequest } from "../services/api";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "OWNER" | "MANAGER" | "STAFF" | "MEMBER";
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const applyToken = useCallback((token: string | null) => {
    if (token) {
      localStorage.setItem("auth_token", token);
      api.defaults.headers.common = api.defaults.headers.common ?? {};
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      localStorage.removeItem("auth_token");
      if (api.defaults.headers.common) {
        delete api.defaults.headers.common.Authorization;
      }
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setLoading(false);
      return;
    }
    applyToken(token);
    fetchCurrentUser()
      .then((data) => setUser(data))
      .catch(() => {
        applyToken(null);
      })
      .finally(() => setLoading(false));
  }, [applyToken]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginRequest(email, password);
    applyToken(result.token);
    setUser(result.user);
  }, [applyToken]);

  const logout = useCallback(() => {
    applyToken(null);
    setUser(null);
  }, [applyToken]);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
    }),
    [user, loading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
