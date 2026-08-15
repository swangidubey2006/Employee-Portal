import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./components/LoginPage.jsx";
import SignupPage from "./components/SignupPage.jsx";
import DashboardPage from "./components/Dashboard/DashboardPage.jsx";
import SettingsPage from "./components/SettingsPage.jsx";
import AttendancePage from "./components/AttendancePage.jsx";

// Protected Route Guard component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Full-screen Dashboard, Settings, & Attendance Routes (Protected) */}
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

        {/* Auth Centered Routes */}
        <Route
          path="/login"
          element={
            <div className="app-container">
              <LoginPage />
            </div>
          }
        />
        <Route
          path="/signup"
          element={
            <div className="app-container">
              <SignupPage />
            </div>
          }
        />

        {/* Fallback Redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;