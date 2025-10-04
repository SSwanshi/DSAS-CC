import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DoctorLoginPage from './pages/DoctorLoginPage';
import PatientLoginPage from './pages/PatientLoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import PatientHomePage from './pages/PatientHomePage';
import DoctorHomePage from './pages/DoctorHomePage';
import AdminHomePage from './pages/AdminHomePage';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main className="container" style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/doctor-login" element={<DoctorLoginPage />} />
            <Route path="/patient-login" element={<PatientLoginPage />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />
            
            {/* User-specific Home Pages */}
            <Route 
              path="/patient-home" 
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <PatientHomePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/doctor-home" 
              element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <DoctorHomePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin-home" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminHomePage />
                </ProtectedRoute>
              } 
            />
            
            {/* Dashboard Routes */}
            <Route 
              path="/patient-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <PatientDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/doctor-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <DoctorDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default AppRoutes;