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
  Select
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  CloudUpload,
  Link as LinkIcon,
  Download,
  Visibility
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

const resourceTypes = ['Notes', 'PPT', 'Video', 'Link', 'Concept', 'Reference'];

const ManageResources = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm();

  const resourceType = watch('resourceType');

  // Fetch resources data
  const { data: resourcesData, isLoading } = useQuery(
    'adminResources',
    async () => {
      const response = await axios.get('/api/resources?limit=100');
      return response.data.resources;
    }
  );

  // Add/Update resource mutation
  const resourceMutation = useMutation(
    async (resourceData) => {
      if (editingResource) {
        const response = await axios.put(`/api/admin/resources/${editingResource._id}`, resourceData);
        return response.data;
      } else {
        const response = await axios.post('/api/admin/resources', resourceData);
        return response.data;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminResources');
        toast.success(editingResource ? 'Resource updated successfully!' : 'Resource added successfully!');
        handleCloseDialog();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Operation failed');
      }
    }
  );

  // Delete resource mutation
  const deleteMutation = useMutation(
    async (resourceId) => {
      await axios.delete(`/api/admin/resources/${resourceId}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminResources');
        toast.success('Resource deleted successfully!');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Delete failed');
      }
    }
  );

  const handleOpenDialog = (resource = null) => {
    setEditingResource(resource);
    if (resource) {
      reset({
        title: resource.title,
        description: resource.description,
        subject: resource.subject,
        department: resource.department,
        resourceType: resource.resourceType,
        fileUrl: resource.fileUrl || '',
        externalLink: resource.externalLink || '',
        semester: resource.semester,
        tags: resource.tags?.join(', ') || ''
      });
    } else {
      reset({
        title: '',
        description: '',
        subject: '',
        department: '',
        resourceType: '',
        fileUrl: '',
        externalLink: '',
        semester: 1,
        tags: ''
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingResource(null);
    reset();
  };

  const onSubmit = (data) => {
    // Process tags
    const processedData = {
      ...data,
      tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
    };

    // Handle file URL vs external link based on resource type
    if (data.resourceType === 'Link') {
      processedData.fileUrl = undefined;
    } else {
      processedData.externalLink = undefined;
    }

    resourceMutation.mutate(processedData);
  };

  const handleDelete = (resourceId) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      deleteMutation.mutate(resourceId);
    }
  };

  const getResourceIcon = (type) => {
    switch (type) {
      case 'Link': return <LinkIcon />;
      case 'Video': return <Visibility />;
      default: return <CloudUpload />;
    }
  };

  const getResourceColor = (type) => {
    switch (type) {
      case 'Notes': return 'success';
      case 'PPT': return 'warning';
      case 'Video': return 'error';
      case 'Link': return 'info';
      default: return 'primary';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Manage Resources
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Resource
        </Button>
      </Box>

      {/* Resources Table */}
      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Semester</TableCell>
                  <TableCell>Downloads</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resourcesData?.map((resource) => (
                  <TableRow key={resource._id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getResourceIcon(resource.resourceType)}
                        <Box sx={{ ml: 1 }}>
                          <Typography variant="body2" fontWeight="bold">
                            {resource.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {resource.description.substring(0, 50)}...
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{resource.subject}</TableCell>
                    <TableCell>{resource.department}</TableCell>
                    <TableCell>
                      <Chip 
                        label={resource.resourceType} 
                        size="small" 
                        color={getResourceColor(resource.resourceType)} 
                      />
                    </TableCell>
                    <TableCell>Sem {resource.semester}</TableCell>
                    <TableCell>{resource.downloadCount}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(resource)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(resource._id)}
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

      {/* Add/Edit Resource Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingResource ? 'Edit Resource' : 'Add New Resource'}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller
                  name="title"
                  control={control}
                  rules={{ required: 'Title is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Resource Title"
                      error={!!errors.title}
                      helperText={errors.title?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="description"
                  control={control}
                  rules={{ required: 'Description is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      rows={3}
                      label="Description"
                      error={!!errors.description}
                      helperText={errors.description?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="subject"
                  control={control}
                  rules={{ required: 'Subject is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Subject"
                      error={!!errors.subject}
                      helperText={errors.subject?.message}
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
                  name="resourceType"
                  control={control}
                  rules={{ required: 'Resource type is required' }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.resourceType}>
                      <InputLabel>Resource Type</InputLabel>
                      <Select {...field} label="Resource Type">
                        {resourceTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="semester"
                  control={control}
                  rules={{ required: 'Semester is required' }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.semester}>
                      <InputLabel>Semester</InputLabel>
                      <Select {...field} label="Semester">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                          <MenuItem key={sem} value={sem}>
                            Semester {sem}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              
              {resourceType === 'Link' ? (
                <Grid item xs={12}>
                  <Controller
                    name="externalLink"
                    control={control}
                    rules={{ required: 'External link is required for Link type' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="External Link URL"
                        placeholder="https://example.com"
                        error={!!errors.externalLink}
                        helperText={errors.externalLink?.message}
                      />
                    )}
                  />
                </Grid>
              ) : (
                <Grid item xs={12}>
                  <Controller
                    name="fileUrl"
                    control={control}
                    rules={{ required: 'File URL is required for file-based resources' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="File URL/Path"
                        placeholder="/resources/filename.pdf"
                        error={!!errors.fileUrl}
                        helperText={errors.fileUrl?.message}
                      />
                    )}
                  />
                </Grid>
              )}
              
              <Grid item xs={12}>
                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Tags (comma separated)"
                      placeholder="programming, algorithms, data-structures"
                      helperText="Enter tags separated by commas"
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
              disabled={resourceMutation.isLoading}
            >
              {resourceMutation.isLoading ? 'Saving...' : (editingResource ? 'Update' : 'Add')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default ManageResources;