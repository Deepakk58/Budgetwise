import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./queryClient";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext";
import ErrorBoundary from "./components/error/ErrorBoundary";

import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>

    <BrowserRouter>

      <QueryClientProvider client={queryClient}>

        <AuthProvider>

          <ErrorBoundary>

            <ThemeProvider>

              <App />

            </ThemeProvider>

          </ErrorBoundary>

        </AuthProvider>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 1500,
          }}
        />

      </QueryClientProvider>

    </BrowserRouter>

  </React.StrictMode>
);
