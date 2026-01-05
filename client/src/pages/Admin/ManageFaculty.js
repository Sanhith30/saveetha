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
  IconButton,
  Chip,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Phone,
  Email,
  School
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

const designations = ['Assistant Professor', 'Associate Professor', 'Professor', 'HOD'];

const ManageFaculty = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  // Fetch faculty data
  const { data: facultyData, isLoading } = useQuery(
    'adminFaculty',
    async () => {
      const response = await axios.get('/api/faculty?limit=100');
      return response.data.faculty;
    }
  );

  // Add/Update faculty mutation
  const facultyMutation = useMutation(
    async (facultyData) => {
      if (editingFaculty) {
        const response = await axios.put(`/api/admin/faculty/${editingFaculty._id}`, facultyData);
        return response.data;
      } else {
        const response = await axios.post('/api/admin/faculty', facultyData);
        return response.data;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminFaculty');
        toast.success(editingFaculty ? 'Faculty updated successfully!' : 'Faculty added successfully!');
        handleCloseDialog();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Operation failed');
      }
    }
  );

  // Delete faculty mutation
  const deleteMutation = useMutation(
    async (facultyId) => {
      await axios.delete(`/api/admin/faculty/${facultyId}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminFaculty');
        toast.success('Faculty deleted successfully!');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Delete failed');
      }
    }
  );

  const handleOpenDialog = (faculty = null) => {
    setEditingFaculty(faculty);
    if (faculty) {
      reset({
        facultyId: faculty.facultyId,
        name: faculty.name,
        department: faculty.department,
        subjects: faculty.subjects,
        contactNumber: faculty.contactNumber,
        email: faculty.email,
        designation: faculty.designation,
        experience: faculty.experience
      });
    } else {
      reset({
        facultyId: '',
        name: '',
        department: '',
        subjects: [],
        contactNumber: '',
        email: '',
        designation: '',
        experience: 0
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingFaculty(null);
    reset();
  };

  const onSubmit = (data) => {
    facultyMutation.mutate(data);
  };

  const handleDelete = (facultyId) => {
    if (window.confirm('Are you sure you want to delete this faculty member?')) {
      deleteMutation.mutate(facultyId);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Manage Faculty
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Faculty
        </Button>
      </Box>

      {/* Faculty Table */}
      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Faculty ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Designation</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Subjects</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {facultyData?.map((faculty) => (
                  <TableRow key={faculty._id}>
                    <TableCell>{faculty.facultyId}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <School sx={{ mr: 1, color: 'primary.main' }} />
                        {faculty.name}
                      </Box>
                    </TableCell>
                    <TableCell>{faculty.department}</TableCell>
                    <TableCell>
                      <Chip label={faculty.designation} size="small" color="primary" />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <Phone sx={{ fontSize: 16, mr: 0.5 }} />
                          <Typography variant="body2">{faculty.contactNumber}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Email sx={{ fontSize: 16, mr: 0.5 }} />
                          <Typography variant="body2">{faculty.email}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {faculty.subjects.slice(0, 2).map((subject, index) => (
                          <Chip key={index} label={subject} size="small" variant="outlined" />
                        ))}
                        {faculty.subjects.length > 2 && (
                          <Chip label={`+${faculty.subjects.length - 2}`} size="small" />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(faculty)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(faculty._id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add/Edit Faculty Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingFaculty ? 'Edit Faculty' : 'Add New Faculty'}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="facultyId"
                  control={control}
                  rules={{ required: 'Faculty ID is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Faculty ID"
                      error={!!errors.facultyId}
                      helperText={errors.facultyId?.message}
                      disabled={!!editingFaculty}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: 'Name is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Full Name"
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
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
                  name="designation"
                  control={control}
                  rules={{ required: 'Designation is required' }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.designation}>
                      <InputLabel>Designation</InputLabel>
                      <Select {...field} label="Designation">
                        {designations.map((desig) => (
                          <MenuItem key={desig} value={desig}>
                            {desig}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="contactNumber"
                  control={control}
                  rules={{ 
                    required: 'Contact number is required',
                    pattern: {
                      value: /^[6-9]\d{9}$/,
                      message: 'Invalid mobile number'
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Contact Number"
                      error={!!errors.contactNumber}
                      helperText={errors.contactNumber?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="email"
                  control={control}
                  rules={{ 
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid email format'
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Email"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="experience"
                  control={control}
                  rules={{ required: 'Experience is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label="Experience (Years)"
                      error={!!errors.experience}
                      helperText={errors.experience?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="subjects"
                  control={control}
                  rules={{ required: 'At least one subject is required' }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.subjects}>
                      <InputLabel>Subjects</InputLabel>
                      <Select
                        {...field}
                        multiple
                        input={<OutlinedInput label="Subjects" />}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip key={value} label={value} size="small" />
                            ))}
                          </Box>
                        )}
                      >
                        <MenuItem value="Data Structures">Data Structures</MenuItem>
                        <MenuItem value="Algorithms">Algorithms</MenuItem>
                        <MenuItem value="Database Management Systems">Database Management Systems</MenuItem>
                        <MenuItem value="Computer Networks">Computer Networks</MenuItem>
                        <MenuItem value="Operating Systems">Operating Systems</MenuItem>
                        <MenuItem value="Software Engineering">Software Engineering</MenuItem>
                        <MenuItem value="Web Technologies">Web Technologies</MenuItem>
                        <MenuItem value="Machine Learning">Machine Learning</MenuItem>
                        <MenuItem value="Artificial Intelligence">Artificial Intelligence</MenuItem>
                        <MenuItem value="Java Programming">Java Programming</MenuItem>
                        <MenuItem value="Python Programming">Python Programming</MenuItem>
                        <MenuItem value="C Programming">C Programming</MenuItem>
                        <MenuItem value="Digital Signal Processing">Digital Signal Processing</MenuItem>
                        <MenuItem value="VLSI Design">VLSI Design</MenuItem>
                        <MenuItem value="Embedded Systems">Embedded Systems</MenuItem>
                        <MenuItem value="Thermodynamics">Thermodynamics</MenuItem>
                        <MenuItem value="Fluid Mechanics">Fluid Mechanics</MenuItem>
                        <MenuItem value="Structural Analysis">Structural Analysis</MenuItem>
                      </Select>
                    </FormControl>
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
              disabled={facultyMutation.isLoading}
            >
              {facultyMutation.isLoading ? 'Saving...' : (editingFaculty ? 'Update' : 'Add')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default ManageFaculty;