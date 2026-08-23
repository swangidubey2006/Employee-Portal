import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./components/LoginPage.jsx";
import DashboardPage from "./components/Dashboard/DashboardPage.jsx";
import SettingsPage from "./components/SettingsPage.jsx";
import AttendancePage from "./components/AttendancePage.jsx";
import LeaveManagementPage from "./components/LeaveManagement/LeaveManagementPage.jsx";
import TasksPage from "./components/Tasks/TasksPage.jsx";
import DocumentsPage from "./components/Documents/DocumentsPage.jsx";
import EmployeeDirectoryPage from "./components/EmployeeDirectory/EmployeeDirectoryPage.jsx";
import OAuthCallback from "./components/OAuthCallback.jsx";
import AttendanceConfirmPage from "./components/AttendanceConfirmPage.jsx";
import AdminManagementPage from "./components/AdminManagementPage.jsx";

// Protected Route Guard component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Public Route Guard component (redirects authenticated users to dashboard)
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Full-screen Application Routes (Protected) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <AttendancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leave-management"
          element={
            <ProtectedRoute>
              <LeaveManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leave"
          element={
            <ProtectedRoute>
              <LeaveManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <TasksPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents"
          element={
            <ProtectedRoute>
              <DocumentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <EmployeeDirectoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/directory"
          element={
            <ProtectedRoute>
              <EmployeeDirectoryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminManagementPage />
            </ProtectedRoute>
          }
        />

        {/* QR attendance confirmation works on a phone after Microsoft sign-in */}
        <Route path="/attendance/confirm" element={<AttendanceConfirmPage />} />

        {/* OAuth callback */}
        <Route path="/oauth/callback" element={<OAuthCallback />} />

        {/* Auth Centered Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <div className="app-container">
                <LoginPage />
              </div>
            </PublicRoute>
          }
        />


        {/* Fallback Redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;