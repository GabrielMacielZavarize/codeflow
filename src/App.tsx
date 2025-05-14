import React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import TaskDetails from "./pages/TaskDetails";
import Team from "./pages/Team";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Reports from "./pages/Reports";
import AuditLogs from "./pages/AuditLogs";
import Calendar from "./pages/Calendar";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Careers from './pages/Careers';
import { Toaster } from "@/components/ui/sonner";

// Create a client
const queryClient = new QueryClient();

// Layout component for authenticated routes
const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="container mx-auto p-4 sm:p-6">
        {children}
      </main>
    </div>
  );
};

// Layout component for auth pages
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      {children}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <LanguageProvider>
            <TooltipProvider>
              <Toaster />
              <Routes>
                {/* Public home page */}
                <Route path="/" element={<Home />} />

                {/* Public routes with AuthLayout */}
                <Route path="/login" element={
                  <AuthLayout>
                    <Login />
                  </AuthLayout>
                } />
                <Route path="/register" element={
                  <AuthLayout>
                    <Register />
                  </AuthLayout>
                } />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Protected routes with AuthenticatedLayout */}
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <AuthenticatedLayout>
                        <Dashboard />
                      </AuthenticatedLayout>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <PrivateRoute>
                      <AuthenticatedLayout>
                        <Analytics />
                      </AuthenticatedLayout>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/task/:id"
                  element={
                    <PrivateRoute>
                      <AuthenticatedLayout>
                        <TaskDetails />
                      </AuthenticatedLayout>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/team"
                  element={
                    <PrivateRoute>
                      <AuthenticatedLayout>
                        <Team />
                      </AuthenticatedLayout>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <PrivateRoute>
                      <AuthenticatedLayout>
                        <Notifications />
                      </AuthenticatedLayout>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <PrivateRoute>
                      <AuthenticatedLayout>
                        <Settings />
                      </AuthenticatedLayout>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <PrivateRoute>
                      <AuthenticatedLayout>
                        <Reports />
                      </AuthenticatedLayout>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/audit-logs"
                  element={
                    <PrivateRoute>
                      <AuthenticatedLayout>
                        <AuditLogs />
                      </AuthenticatedLayout>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/calendar"
                  element={
                    <PrivateRoute>
                      <AuthenticatedLayout>
                        <Calendar />
                      </AuthenticatedLayout>
                    </PrivateRoute>
                  }
                />

                {/* 404 page */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </LanguageProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
