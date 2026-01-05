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
import { Visibility, VisibilityOff, School } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
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

    const result = await login(data);
    
    if (result.success) {
      navigate('/dashboard');
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
            <School sx={{ fontSize: 40, color: 'primary.main', mr: 1 }} />
            <Typography component="h1" variant="h4" color="primary" fontWeight="bold">
              Saveetha Portal
            </Typography>
          </Box>

          <Typography component="h2" variant="h5" sx={{ mb: 3 }}>
            Student Login
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
              id="regNo"
              label="Registration Number"
              placeholder="1923xxxxx"
              autoComplete="username"
              autoFocus
              {...register('regNo', {
                required: 'Registration number is required',
                pattern: {
                  value: /^1923\d{5}$/,
                  message: 'Invalid registration number format (1923xxxxx)'
                }
              })}
              error={!!errors.regNo}
              helperText={errors.regNo?.message}
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
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Link component={RouterLink} to="/register" variant="body2">
                Don't have an account? Sign Up
              </Link>
            </Box>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link component={RouterLink} to="/admin/login" variant="body2" color="secondary">
                Admin Login
              </Link>
            </Box>
          </Box>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Faculty Rating & Academic Resource Portal
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Saveetha School of Engineering
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;