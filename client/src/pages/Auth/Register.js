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
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { Visibility, VisibilityOff, School } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';

const departments = [
  'Computer Science and Engineering',
  'Information Technology',
  'Electronics and Communication Engineering',
  'Electrical and Electronics Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Biomedical Engineering',
  'Biotechnology',
  'Chemical Engineering'
];

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    const result = await registerUser(data);
    
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
          py: 4,
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
            Student Registration
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

            <FormControl fullWidth margin="normal" required>
              <InputLabel id="department-label">Department</InputLabel>
              <Controller
                name="department"
                control={control}
                rules={{ required: 'Department is required' }}
                render={({ field }) => (
                  <Select
                    labelId="department-label"
                    label="Department"
                    {...field}
                    error={!!errors.department}
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept} value={dept}>
                        {dept}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.department && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                  {errors.department.message}
                </Typography>
              )}
            </FormControl>

            <FormControl fullWidth margin="normal" required>
              <InputLabel id="year-label">Year</InputLabel>
              <Controller
                name="year"
                control={control}
                rules={{ required: 'Year is required' }}
                render={({ field }) => (
                  <Select
                    labelId="year-label"
                    label="Year"
                    {...field}
                    error={!!errors.year}
                  >
                    <MenuItem value={1}>1st Year</MenuItem>
                    <MenuItem value={2}>2nd Year</MenuItem>
                    <MenuItem value={3}>3rd Year</MenuItem>
                    <MenuItem value={4}>4th Year</MenuItem>
                  </Select>
                )}
              />
              {errors.year && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                  {errors.year.message}
                </Typography>
              )}
            </FormControl>

            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="new-password"
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
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Link component={RouterLink} to="/login" variant="body2">
                Already have an account? Sign In
              </Link>
            </Box>
          </Box>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              By registering, you agree to use this platform responsibly
            </Typography>
            <Typography variant="body2" color="text.secondary">
              and provide honest, constructive feedback.
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;