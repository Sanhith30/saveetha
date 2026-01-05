import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import {
  Add,
  Person
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';

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

const ManageStudents = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  // Fetch students data
  const { data: studentsData } = useQuery(
    'adminStudents',
    async () => {
      const response = await axios.get('/api/admin/students?limit=100');
      return response.data.students;
    }
  );

  // Add student mutation
  const studentMutation = useMutation(
    async (studentData) => {
      const response = await axios.post('/api/auth/register', studentData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminStudents');
        toast.success('Student added successfully!');
        handleCloseDialog();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Operation failed');
      }
    }
  );

  const handleOpenDialog = () => {
    reset({
      regNo: '',
      department: '',
      year: 1,
      password: 'student123' // Default password
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    reset();
  };

  const onSubmit = (data) => {
    studentMutation.mutate(data);
  };

  const getYearLabel = (year) => {
    const suffixes = ['st', 'nd', 'rd', 'th'];
    return `${year}${suffixes[year - 1] || 'th'} Year`;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Manage Students
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenDialog}
        >
          Add Student
        </Button>
      </Box>

      {/* Students Table */}
      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Registration No</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Year</TableCell>
                  <TableCell>Joined Date</TableCell>
                  <TableCell>Last Login</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {studentsData?.map((student) => (
                  <TableRow key={student._id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Person sx={{ mr: 1, color: 'primary.main' }} />
                        {student.regNo}
                      </Box>
                    </TableCell>
                    <TableCell>{student.department}</TableCell>
                    <TableCell>
                      <Chip label={getYearLabel(student.year)} size="small" color="primary" />
                    </TableCell>
                    <TableCell>
                      {new Date(student.createdAt).toLocaleDateString('en-IN')}
                    </TableCell>
                    <TableCell>
                      {student.lastLogin ? new Date(student.lastLogin).toLocaleDateString('en-IN') : 'Never'}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={student.isActive ? 'Active' : 'Inactive'} 
                        size="small" 
                        color={student.isActive ? 'success' : 'error'} 
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add Student Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Student</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller
                  name="regNo"
                  control={control}
                  rules={{ 
                    required: 'Registration number is required',
                    pattern: {
                      value: /^1923\d{5}$/,
                      message: 'Invalid registration number format (1923xxxxx)'
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Registration Number"
                      placeholder="1923xxxxx"
                      error={!!errors.regNo}
                      helperText={errors.regNo?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="department"
                  control={control}
                  rules={{ required: 'Department is required' }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.department}>
                      <InputLabel>Department</InputLabel>
                      <Select {...field} label="Department">
                        {departments.map((dept) => (
                          <MenuItem key={dept} value={dept}>
                            {dept}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="year"
                  control={control}
                  rules={{ required: 'Year is required' }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.year}>
                      <InputLabel>Year</InputLabel>
                      <Select {...field} label="Year">
                        <MenuItem value={1}>1st Year</MenuItem>
                        <MenuItem value={2}>2nd Year</MenuItem>
                        <MenuItem value={3}>3rd Year</MenuItem>
                        <MenuItem value={4}>4th Year</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="password"
                  control={control}
                  rules={{ 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="password"
                      label="Password"
                      error={!!errors.password}
                      helperText={errors.password?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained"
              disabled={studentMutation.isLoading}
            >
              {studentMutation.isLoading ? 'Adding...' : 'Add Student'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default ManageStudents;