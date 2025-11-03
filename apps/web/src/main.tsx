/// <reference types="vite/client" />

import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import App from "./App";
import "./styles.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
      onError: (error) => {
        console.error('Query error:', {
          error,
          message: error instanceof Error ? error.message : 'Unknown error',
          response: error && typeof error === 'object' && 'response' in error ? error.response : undefined,
        });
      }
    },
  },
});

const prepare = async () => {
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("Root element not found");

  ReactDOM.createRoot(rootElement).render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
          <ReactQueryDevtools />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

prepare().catch(console.error);
