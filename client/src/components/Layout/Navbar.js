import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Divider
} from '@mui/material';
import {
  AccountCircle,
  Dashboard,
  People,
  Star,
  LibraryBooks,
  ExitToApp,
  School
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    const redirectPath = user?.type === 'admin' ? '/admin/login' : '/login';
    logout();
    handleClose();
    navigate(redirectPath);
  };

  const navItems = user?.type === 'admin' ? [
    { label: 'Dashboard', path: '/admin/dashboard', icon: <Dashboard /> },
    { label: 'Faculty', path: '/admin/manage-faculty', icon: <School /> },
    { label: 'Students', path: '/admin/manage-students', icon: <People /> },
    { label: 'Resources', path: '/admin/manage-resources', icon: <LibraryBooks /> },
  ] : [
    { label: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
    { label: 'Faculty', path: '/faculty', icon: <People /> },
    { label: 'My Ratings', path: '/my-ratings', icon: <Star /> },
    { label: 'Resources', path: '/resources', icon: <LibraryBooks /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar position="sticky" elevation={2}>
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            fontWeight: 600,
            cursor: 'pointer'
          }}
          onClick={() => navigate(user?.type === 'admin' ? '/admin/dashboard' : '/dashboard')}
        >
          {user?.type === 'admin' ? 'Saveetha Admin Portal' : 'Saveetha Faculty Portal'}
        </Typography>

        {/* Navigation Items */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 2 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              startIcon={item.icon}
              onClick={() => navigate(item.path)}
              sx={{
                mx: 1,
                backgroundColor: isActive(item.path) ? 'rgba(255,255,255,0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* User Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mr: 1, display: { xs: 'none', sm: 'block' } }}>
            {user?.type === 'admin' ? user.name : user?.regNo}
          </Typography>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
              {user?.type === 'admin' ? user.name?.[0] : user?.regNo?.[0]}
            </Avatar>
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem disabled>
              <Typography variant="body2" color="text.secondary">
                {user?.type === 'admin' ? `Admin: ${user.email}` : `Student: ${user?.regNo}`}
              </Typography>
            </MenuItem>
            <Divider />
            
            {user?.type === 'student' && (
              <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
                <AccountCircle sx={{ mr: 1 }} />
                Profile
              </MenuItem>
            )}
            
            {user?.type === 'admin' && (
              <MenuItem onClick={() => { navigate('/admin/dashboard'); handleClose(); }}>
                <Dashboard sx={{ mr: 1 }} />
                Admin Dashboard
              </MenuItem>
            )}
            
            <MenuItem onClick={handleLogout}>
              <ExitToApp sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;