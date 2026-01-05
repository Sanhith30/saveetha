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
  Rating,
  CircularProgress,
  InputAdornment,
  Pagination
} from '@mui/material';
import {
  Search,
  Phone,
  Email,
  School,
  FilterList
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';

const FacultyList = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    department: '',
    subject: '',
    search: '',
    sortBy: 'name',
    sortOrder: 'asc',
    page: 1
  });

  // Fetch faculty data
  const { data: facultyData, isLoading } = useQuery(
    ['faculty', filters],
    async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await axios.get(`/api/faculty?${params}`);
      return response.data;
    }
  );

  // Fetch departments for filter
  const { data: departments } = useQuery(
    'departments',
    async () => {
      const response = await axios.get('/api/faculty/meta/departments');
      return response.data.departments;
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

  const getStrictnessColor = (strictness) => {
    if (strictness === 'loose') return 'success';
    if (strictness === 'moderate') return 'warning';
    if (strictness === 'strict') return 'error';
    return 'default';
  };

  const getDominantStrictness = (distribution) => {
    const { loose, moderate, strict } = distribution;
    const max = Math.max(loose, moderate, strict);
    if (max === loose) return { label: 'Loose', value: loose };
    if (max === moderate) return { label: 'Moderate', value: moderate };
    return { label: 'Strict', value: strict };
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
          Faculty Directory
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse faculty ratings, contact information, and teaching styles
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
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search faculty or subject..."
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
            
            <Grid item xs={12} md={3}>
              <TextField
                select
                fullWidth
                label="Department"
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
              >
                <MenuItem value="">All Departments</MenuItem>
                {departments?.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <TextField
                select
                fullWidth
                label="Sort By"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="rating">Rating</MenuItem>
                <MenuItem value="strictness">Strictness</MenuItem>
              </TextField>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <TextField
                select
                fullWidth
                label="Order"
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
              >
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </TextField>
            </Grid>
            
            <Grid item xs={12} md={1}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setFilters({
                  department: '',
                  subject: '',
                  search: '',
                  sortBy: 'name',
                  sortOrder: 'asc',
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

      {/* Faculty Cards */}
      <Grid container spacing={3}>
        {facultyData?.faculty?.map((faculty) => {
          const showRatings = faculty.totalRatings >= 3;
          const dominantStrictness = showRatings ? getDominantStrictness(faculty.strictnessDistribution) : null;
          
          return (
            <Grid item xs={12} md={6} lg={4} key={faculty._id}>
              <Card 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
                onClick={() => navigate(`/faculty/${faculty._id}`)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <School sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" fontWeight="bold">
                      {faculty.name}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {faculty.designation}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {faculty.department}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight="medium" gutterBottom>
                      Subjects:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {faculty.subjects.slice(0, 3).map((subject, index) => (
                        <Chip 
                          key={index}
                          label={subject} 
                          size="small" 
                          variant="outlined"
                        />
                      ))}
                      {faculty.subjects.length > 3 && (
                        <Chip 
                          label={`+${faculty.subjects.length - 3} more`} 
                          size="small" 
                          variant="outlined"
                          color="primary"
                        />
                      )}
                    </Box>
                  </Box>

                  {showRatings ? (
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Rating 
                          value={faculty.averageRating.overallRating} 
                          readOnly 
                          precision={0.1}
                          size="small"
                        />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {faculty.averageRating.overallRating.toFixed(1)}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip 
                          label={`${dominantStrictness.label} (${dominantStrictness.value}%)`}
                          size="small"
                          color={getStrictnessColor(dominantStrictness.label.toLowerCase())}
                          variant="outlined"
                        />
                        <Typography variant="caption" color="text.secondary">
                          {faculty.totalRatings} ratings
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Not enough ratings yet
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Phone sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        Contact
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Email sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        Email
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/rate/${faculty._id}`);
                      }}
                    >
                      Rate Faculty
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/faculty/${faculty._id}`);
                      }}
                    >
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Pagination */}
      {facultyData?.pagination && facultyData.pagination.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={facultyData.pagination.totalPages}
            page={filters.page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}

      {/* No Results */}
      {facultyData?.faculty?.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No faculty found matching your criteria
          </Typography>
          <Button 
            variant="outlined" 
            sx={{ mt: 2 }}
            onClick={() => setFilters({
              department: '',
              subject: '',
              search: '',
              sortBy: 'name',
              sortOrder: 'asc',
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

export default FacultyList;