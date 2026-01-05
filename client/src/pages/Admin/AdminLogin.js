import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Alert,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff, AdminPanelSettings } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    const result = await login(data, 'admin');
    
    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <AdminPanelSettings sx={{ fontSize: 40, color: 'secondary.main', mr: 1 }} />
            <Typography component="h1" variant="h4" color="secondary" fontWeight="bold">
              Admin Portal
            </Typography>
          </Box>

          <Typography component="h2" variant="h5" sx={{ mb: 3 }}>
            Administrator Login
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Admin Email"
              placeholder="admin@saveetha.ac.in"
              autoComplete="email"
              autoFocus
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email format'
                }
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Admin Sign In'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Link component={RouterLink} to="/login" variant="body2">
                Student Login
              </Link>
            </Box>
          </Box>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Administrative Access Only
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Saveetha School of Engineering
            </Typography>
          </Box>

          {/* Development Credentials Info */}
          <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 1, width: '100%' }}>
            <Typography variant="body2" color="info.contrastText" sx={{ fontWeight: 'bold', mb: 1 }}>
              Development Credentials:
            </Typography>
            <Typography variant="body2" color="info.contrastText">
              Email: admin@saveetha.ac.in
            </Typography>
            <Typography variant="body2" color="info.contrastText">
              Password: admin123
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default AdminLogin;