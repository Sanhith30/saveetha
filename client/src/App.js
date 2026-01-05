import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';

import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Layout/Navbar';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import FacultyList from './pages/Faculty/FacultyList';
import FacultyDetail from './pages/Faculty/FacultyDetail';
import RateFaculty from './pages/Rating/RateFaculty';
import MyRatings from './pages/Rating/MyRatings';
import Resources from './pages/Resources/Resources';
import Profile from './pages/Profile/Profile';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ManageFaculty from './pages/Admin/ManageFaculty';
import ManageStudents from './pages/Admin/ManageStudents';
import ManageResources from './pages/Admin/ManageResources';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        sx={{ backgroundColor: '#f5f5f5' }}
      >
        <Typography variant="h4" sx={{ mb: 2, color: 'primary.main' }}>
          Saveetha Faculty Portal
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Loading application...
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CircularProgress size={24} sx={{ mr: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Please wait while we initialize the portal
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {user && <Navbar />}
      
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={user ? (user.type === 'admin' ? <Navigate to="/admin/dashboard" /> : <Navigate to="/dashboard" />) : <Login />} 
        />
        <Route 
          path="/register" 
          element={user ? (user.type === 'admin' ? <Navigate to="/admin/dashboard" /> : <Navigate to="/dashboard" />) : <Register />} 
        />
        <Route 
          path="/admin/login" 
          element={user ? (user.type === 'admin' ? <Navigate to="/admin/dashboard" /> : <Navigate to="/dashboard" />) : <AdminLogin />} 
        />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute />}>
          <Route index element={user?.type === 'admin' ? <Navigate to="/admin/dashboard" /> : <Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="faculty" element={<FacultyList />} />
          <Route path="faculty/:id" element={<FacultyDetail />} />
          <Route path="rate/:facultyId" element={<RateFaculty />} />
          <Route path="my-ratings" element={<MyRatings />} />
          <Route path="resources" element={<Resources />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute adminOnly />}>
          <Route index element={<Navigate to="/admin/dashboard" />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="manage-faculty" element={<ManageFaculty />} />
          <Route path="manage-students" element={<ManageStudents />} />
          <Route path="manage-resources" element={<ManageResources />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Box>
  );
}

export default App;