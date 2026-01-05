import React, { useState } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Person, Lock, Edit } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';

const Profile = () => {
  const { user, changePassword } = useAuth();
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm();

  const newPassword = watch('newPassword');

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage('');

    const result = await changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword
    });

    if (result.success) {
      setMessage('Password changed successfully!');
      reset();
      setPasswordDialogOpen(false);
    } else {
      setMessage(result.message);
    }

    setLoading(false);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          My Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage your account information
        </Typography>
      </Box>

      {message && (
        <Alert 
          severity={message.includes('successfully') ? 'success' : 'error'} 
          sx={{ mb: 3 }}
          onClose={() => setMessage('')}
        >
          {message}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Profile Information */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Person sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" fontWeight="bold">
                  Profile Information
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Registration Number"
                    value={user?.regNo || ''}
                    disabled
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Year"
                    value={user?.year ? `${user.year}${user.year === 1 ? 'st' : user.year === 2 ? 'nd' : user.year === 3 ? 'rd' : 'th'} Year` : ''}
                    disabled
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Department"
                    value={user?.department || ''}
                    disabled
                    variant="outlined"
                    multiline
                    rows={2}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Account Created"
                    value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : ''}
                    disabled
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Login"
                    value={user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : ''}
                    disabled
                    variant="outlined"
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                <Typography variant="body2" color="info.contrastText">
                  <strong>Note:</strong> Profile information is based on your registration number and cannot be modified. 
                  If you need to update any information, please contact the administration.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Security Settings */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Lock sx={{ mr: 1, color: 'secondary.main' }} />
                <Typography variant="h6" fontWeight="bold">
                  Security
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Keep your account secure by using a strong password.
              </Typography>

              <Button
                fullWidth
                variant="contained"
                startIcon={<Edit />}
                onClick={() => setPasswordDialogOpen(true)}
              >
                Change Password
              </Button>

              <Box sx={{ mt: 3, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                <Typography variant="body2" color="warning.contrastText">
                  <strong>Security Tips:</strong>
                  <br />• Use a strong, unique password
                  <br />• Don't share your login credentials
                  <br />• Log out from shared computers
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Change Password Dialog */}
      <Dialog 
        open={passwordDialogOpen} 
        onClose={() => setPasswordDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Change Password</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <TextField
              fullWidth
              type="password"
              label="Current Password"
              margin="normal"
              {...register('currentPassword', {
                required: 'Current password is required'
              })}
              error={!!errors.currentPassword}
              helperText={errors.currentPassword?.message}
            />

            <TextField
              fullWidth
              type="password"
              label="New Password"
              margin="normal"
              {...register('newPassword', {
                required: 'New password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters long'
                }
              })}
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
            />

            <TextField
              fullWidth
              type="password"
              label="Confirm New Password"
              margin="normal"
              {...register('confirmPassword', {
                required: 'Please confirm your new password',
                validate: value => value === newPassword || 'Passwords do not match'
              })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => {
                setPasswordDialogOpen(false);
                reset();
                setMessage('');
              }}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              disabled={loading}
            >
              {loading ? 'Changing...' : 'Change Password'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default Profile;