import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';

import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { AdminDashboard } from './pages/AdminDashboard';
import { NormalDashboard } from './pages/NormalDashboard';
import { OwnerDashboard } from './pages/OwnerDashboard';

const Unauthorized = () => <div className="animate-fade-in" style={{textAlign: 'center', marginTop: '4rem'}}><h2>403 - Unauthorized</h2></div>;

const RootRedirect = () => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
  
  if (user.role === 'ADMIN' || user.role === 'ROLE_SUPERADMIN') return <Navigate to="/admin" replace />;
  if (user.role === 'STORE_OWNER') return <Navigate to="/owner" replace />;
  return <Navigate to="/stores" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container flex-col">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<RootRedirect />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              <Route path="/admin/*" element={
                <ProtectedRoute allowedRoles={['ADMIN', 'ROLE_SUPERADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/stores/*" element={
                <ProtectedRoute allowedRoles={['NORMAL', 'ADMIN', 'ROLE_SUPERADMIN']}>
                  <NormalDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/owner/*" element={
                <ProtectedRoute allowedRoles={['STORE_OWNER']}>
                  <OwnerDashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
