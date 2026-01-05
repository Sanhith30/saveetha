import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  MenuItem,
  Button,
  Chip,
  CircularProgress,
  InputAdornment,
  Pagination
} from '@mui/material';
import {
  Search,
  FilterList,
  Download,
  Visibility,
  LibraryBooks,
  VideoLibrary,
  Link as LinkIcon,
  PictureAsPdf,
  Description
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import axios from 'axios';

const Resources = () => {
  const [filters, setFilters] = useState({
    department: '',
    subject: '',
    resourceType: '',
    semester: '',
    search: '',
    page: 1
  });

  // Fetch resources data
  const { data: resourcesData, isLoading } = useQuery(
    ['resources', filters],
    async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await axios.get(`/api/resources?${params}`);
      return response.data;
    }
  );

  // Fetch departments for filter
  const { data: departments } = useQuery(
    'resourceDepartments',
    async () => {
      const response = await axios.get('/api/resources/meta/departments');
      return response.data.departments;
    }
  );

  // Fetch resource types for filter
  const { data: resourceTypes } = useQuery(
    'resourceTypes',
    async () => {
      const response = await axios.get('/api/resources/meta/types');
      return response.data.types;
    }
  );

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
      page: 1 // Reset to first page when filtering
    }));
  };

  const handlePageChange = (event, value) => {
    setFilters(prev => ({ ...prev, page: value }));
  };

  const getResourceIcon = (type) => {
    switch (type) {
      case 'Video': return <VideoLibrary />;
      case 'Link': return <LinkIcon />;
      case 'PPT': return <Description />;
      case 'Notes': return <PictureAsPdf />;
      default: return <LibraryBooks />;
    }
  };

  const getResourceColor = (type) => {
    switch (type) {
      case 'Video': return 'error';
      case 'Link': return 'info';
      case 'PPT': return 'warning';
      case 'Notes': return 'success';
      default: return 'primary';
    }
  };

  const handleResourceAccess = async (resource) => {
    try {
      // Increment download count
      await axios.get(`/api/resources/${resource._id}`);
      
      // Open resource
      if (resource.resourceType === 'Link') {
        window.open(resource.externalLink, '_blank');
      } else {
        // For files, you would typically serve them from your server
        // This is a placeholder - implement actual file serving
        window.open(resource.fileUrl, '_blank');
      }
    } catch (error) {
      console.error('Error accessing resource:', error);
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Academic Resources
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Access study materials, notes, videos, and reference links for all subjects
        </Typography>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FilterList sx={{ mr: 1 }} />
            <Typography variant="h6">Filters & Search</Typography>
          </Box>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Search resources..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
              <TextField
                select
                fullWidth
                label="Department"
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
              >
                <MenuItem value="">All Departments</MenuItem>
                {departments?.map((dept) => (
                  <MenuItem key={dept._id} value={dept._id}>
                    {dept._id} ({dept.count})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <TextField
                select
                fullWidth
                label="Resource Type"
                value={filters.resourceType}
                onChange={(e) => handleFilterChange('resourceType', e.target.value)}
              >
                <MenuItem value="">All Types</MenuItem>
                {resourceTypes?.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <TextField
                select
                fullWidth
                label="Semester"
                value={filters.semester}
                onChange={(e) => handleFilterChange('semester', e.target.value)}
              >
                <MenuItem value="">All Semesters</MenuItem>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <MenuItem key={sem} value={sem}>
                    Semester {sem}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                label="Subject"
                value={filters.subject}
                onChange={(e) => handleFilterChange('subject', e.target.value)}
                placeholder="Enter subject"
              />
            </Grid>
            
            <Grid item xs={12} md={1}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setFilters({
                  department: '',
                  subject: '',
                  resourceType: '',
                  semester: '',
                  search: '',
                  page: 1
                })}
                sx={{ height: '56px' }}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Resources Grid */}
      <Grid container spacing={3}>
        {resourcesData?.resources?.map((resource) => (
          <Grid item xs={12} md={6} lg={4} key={resource._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ color: `${getResourceColor(resource.resourceType)}.main`, mr: 1 }}>
                    {getResourceIcon(resource.resourceType)}
                  </Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ flexGrow: 1 }}>
                    {resource.title}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {resource.description}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Subject:</strong> {resource.subject}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Department:</strong> {resource.department}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Semester:</strong> {resource.semester}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Chip 
                    label={resource.resourceType}
                    size="small"
                    color={getResourceColor(resource.resourceType)}
                    variant="outlined"
                  />
                  {resource.tags?.map((tag, index) => (
                    <Chip 
                      key={index}
                      label={tag}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                  <Typography variant="caption" color="text.secondary">
                    {resource.downloadCount} downloads
                  </Typography>
                  
                  <Box>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={resource.resourceType === 'Link' ? <Visibility /> : <Download />}
                      onClick={() => handleResourceAccess(resource)}
                    >
                      {resource.resourceType === 'Link' ? 'View' : 'Download'}
                    </Button>
                  </Box>
                </Box>

                {resource.fileSize && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Size: {(resource.fileSize / 1024 / 1024).toFixed(2)} MB
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {resourcesData?.pagination && resourcesData.pagination.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={resourcesData.pagination.totalPages}
            page={filters.page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}

      {/* No Results */}
      {resourcesData?.resources?.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <LibraryBooks sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No resources found matching your criteria
          </Typography>
          <Button 
            variant="outlined" 
            sx={{ mt: 2 }}
            onClick={() => setFilters({
              department: '',
              subject: '',
              resourceType: '',
              semester: '',
              search: '',
              page: 1
            })}
          >
            Clear Filters
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default Resources;