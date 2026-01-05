import React from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
  Button
} from '@mui/material';
import {
  People,
  School,
  LibraryBooks,
  Star,
  TrendingUp,
  Assessment,
  Add,
  Settings
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  // Fetch dashboard data
  const { data: dashboardData, isLoading } = useQuery(
    'adminDashboard',
    async () => {
      const response = await axios.get('/api/admin/dashboard');
      return response.data;
    }
  );

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  const stats = dashboardData?.stats || {};
  const recentRatings = dashboardData?.recentRatings || [];
  const topRatedFaculty = dashboardData?.topRatedFaculty || [];

  const statCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents || 0,
      icon: <People />,
      color: 'primary'
    },
    {
      title: 'Total Faculty',
      value: stats.totalFaculty || 0,
      icon: <School />,
      color: 'secondary'
    },
    {
      title: 'Total Resources',
      value: stats.totalResources || 0,
      icon: <LibraryBooks />,
      color: 'success'
    },
    {
      title: 'Total Ratings',
      value: stats.totalRatings || 0,
      icon: <Star />,
      color: 'warning'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #dc004e 0%, #ff5983 100%)', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Assessment sx={{ fontSize: 40, mr: 2 }} />
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Admin Dashboard
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Saveetha Faculty Portal Management
            </Typography>
          </Box>
        </Box>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Monitor system statistics, manage content, and oversee platform activities.
        </Typography>
      </Paper>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ color: `${stat.color}.main`, mb: 2 }}>
                  {React.cloneElement(stat.icon, { sx: { fontSize: 48 } })}
                </Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {stat.value}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        {/* Recent Ratings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Star sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6" fontWeight="bold">
                  Recent Ratings
                </Typography>
              </Box>
              
              {recentRatings.length > 0 ? (
                <List>
                  {recentRatings.map((rating) => (
                    <ListItem key={rating._id} divider>
                      <ListItemText
                        primary={rating.facultyId?.name}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {rating.facultyId?.department}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <Chip 
                                label={`${rating.teachingQuality}/5`}
                                size="small" 
                                color="primary" 
                                variant="outlined"
                                sx={{ mr: 1 }}
                              />
                              <Chip 
                                label={rating.strictness} 
                                size="small" 
                                color={
                                  rating.strictness === 'Loose' ? 'success' :
                                  rating.strictness === 'Moderate' ? 'warning' : 'error'
                                }
                                variant="outlined"
                              />
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary">
                  No recent ratings available.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Top Rated Faculty */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6" fontWeight="bold">
                  Top Rated Faculty
                </Typography>
              </Box>
              
              {topRatedFaculty.length > 0 ? (
                <List>
                  {topRatedFaculty.map((faculty, index) => (
                    <ListItem key={faculty._id} divider>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ 
                              width: 24, 
                              height: 24, 
                              borderRadius: '50%', 
                              backgroundColor: 'primary.main',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.875rem',
                              fontWeight: 'bold',
                              mr: 2
                            }}>
                              {index + 1}
                            </Box>
                            {faculty.name}
                          </Box>
                        }
                        secondary={
                          <Box sx={{ ml: 4 }}>
                            <Typography variant="body2" color="text.secondary">
                              {faculty.department}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <Star sx={{ fontSize: 16, color: 'warning.main', mr: 0.5 }} />
                              <Typography variant="body2">
                                {faculty.averageRating.overallRating.toFixed(1)} 
                                ({faculty.totalRatings} ratings)
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary">
                  No faculty ratings available yet.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Management Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<School />}
                    onClick={() => navigate('/admin/manage-faculty')}
                    sx={{ py: 2 }}
                  >
                    Manage Faculty
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<People />}
                    onClick={() => navigate('/admin/manage-students')}
                    sx={{ py: 2 }}
                  >
                    Manage Students
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<LibraryBooks />}
                    onClick={() => navigate('/admin/manage-resources')}
                    sx={{ py: 2 }}
                  >
                    Manage Resources
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Assessment />}
                    onClick={() => navigate('/admin/ratings')}
                    sx={{ py: 2 }}
                  >
                    View All Ratings
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions - Legacy */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Quick Actions Guide
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Use the buttons above to access management features:
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">• <strong>Manage Faculty</strong> - Add, edit faculty members with contact details</Typography>
                <Typography variant="body2">• <strong>Manage Students</strong> - Add new student accounts</Typography>
                <Typography variant="body2">• <strong>Manage Resources</strong> - Upload and organize academic materials</Typography>
                <Typography variant="body2">• <strong>View All Ratings</strong> - Monitor and moderate student ratings</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;