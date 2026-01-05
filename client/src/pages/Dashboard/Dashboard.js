import React from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip
} from '@mui/material';
import {
  People,
  Star,
  LibraryBooks,
  TrendingUp,
  School,
  Assessment
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch dashboard data
  const { data: dashboardData, isLoading } = useQuery(
    'dashboardData',
    async () => {
      const [facultyRes, ratingsRes, resourcesRes] = await Promise.all([
        axios.get('/api/faculty?limit=5&sortBy=rating&sortOrder=desc'),
        axios.get('/api/ratings/my-ratings?limit=5'),
        axios.get('/api/resources/recent/latest?limit=5')
      ]);

      return {
        topFaculty: facultyRes.data.faculty,
        myRatings: ratingsRes.data.ratings,
        recentResources: resourcesRes.data.resources
      };
    },
    {
      enabled: !!user
    }
  );

  const quickActions = [
    {
      title: 'Browse Faculty',
      description: 'View faculty ratings and contact information',
      icon: <People />,
      color: 'primary',
      action: () => navigate('/faculty')
    },
    {
      title: 'Rate Faculty',
      description: 'Share your experience with faculty members',
      icon: <Star />,
      color: 'secondary',
      action: () => navigate('/faculty')
    },
    {
      title: 'Academic Resources',
      description: 'Access notes, concepts, and study materials',
      icon: <LibraryBooks />,
      color: 'success',
      action: () => navigate('/resources')
    },
    {
      title: 'My Ratings',
      description: 'View and manage your submitted ratings',
      icon: <Assessment />,
      color: 'info',
      action: () => navigate('/my-ratings')
    }
  ];

  const getStrictnessColor = (strictness) => {
    switch (strictness) {
      case 'Loose': return 'success';
      case 'Moderate': return 'warning';
      case 'Strict': return 'error';
      default: return 'default';
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography>Loading dashboard...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Welcome Section */}
      <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <School sx={{ fontSize: 40, mr: 2 }} />
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Welcome to Saveetha Faculty Portal
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Hello, {user?.regNo} • {user?.department}
            </Typography>
          </Box>
        </Box>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Your one-stop platform for faculty ratings, contact information, and academic resources.
        </Typography>
      </Paper>

      {/* Quick Actions */}
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Quick Actions
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {quickActions.map((action, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
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
              onClick={action.action}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ color: `${action.color}.main`, mb: 2 }}>
                  {React.cloneElement(action.icon, { sx: { fontSize: 48 } })}
                </Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {action.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {action.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        {/* Top Rated Faculty */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" fontWeight="bold">
                  Top Rated Faculty
                </Typography>
              </Box>
              
              {dashboardData?.topFaculty?.length > 0 ? (
                <List>
                  {dashboardData.topFaculty.map((faculty, index) => (
                    <ListItem 
                      key={faculty._id}
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: 'action.hover' }
                      }}
                      onClick={() => navigate(`/faculty/${faculty._id}`)}
                    >
                      <ListItemIcon>
                        <Box sx={{ 
                          width: 32, 
                          height: 32, 
                          borderRadius: '50%', 
                          backgroundColor: 'primary.main',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold'
                        }}>
                          {index + 1}
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={faculty.name}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {faculty.department}
                            </Typography>
                            {faculty.totalRatings >= 3 && (
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                <Star sx={{ fontSize: 16, color: 'warning.main', mr: 0.5 }} />
                                <Typography variant="body2">
                                  {faculty.averageRating.overallRating.toFixed(1)} 
                                  ({faculty.totalRatings} ratings)
                                </Typography>
                              </Box>
                            )}
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
              
              <Button 
                fullWidth 
                variant="outlined" 
                sx={{ mt: 2 }}
                onClick={() => navigate('/faculty')}
              >
                View All Faculty
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Resources */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LibraryBooks sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6" fontWeight="bold">
                  Recent Resources
                </Typography>
              </Box>
              
              {dashboardData?.recentResources?.length > 0 ? (
                <List>
                  {dashboardData.recentResources.map((resource) => (
                    <ListItem 
                      key={resource._id}
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: 'action.hover' }
                      }}
                      onClick={() => navigate('/resources')}
                    >
                      <ListItemText
                        primary={resource.title}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {resource.subject}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <Chip 
                                label={resource.resourceType} 
                                size="small" 
                                color="primary" 
                                variant="outlined"
                                sx={{ mr: 1 }}
                              />
                              <Typography variant="caption" color="text.secondary">
                                {resource.downloadCount} downloads
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
                  No resources available yet.
                </Typography>
              )}
              
              <Button 
                fullWidth 
                variant="outlined" 
                sx={{ mt: 2 }}
                onClick={() => navigate('/resources')}
              >
                Browse All Resources
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* My Recent Ratings */}
        {dashboardData?.myRatings?.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Star sx={{ mr: 1, color: 'warning.main' }} />
                  <Typography variant="h6" fontWeight="bold">
                    My Recent Ratings
                  </Typography>
                </Box>
                
                <List>
                  {dashboardData.myRatings.map((rating) => (
                    <ListItem key={rating._id}>
                      <ListItemText
                        primary={rating.facultyId?.name}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {rating.subject} • {rating.facultyId?.department}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                                <Star sx={{ fontSize: 16, color: 'warning.main', mr: 0.5 }} />
                                <Typography variant="body2">
                                  {rating.teachingQuality}/5
                                </Typography>
                              </Box>
                              <Chip 
                                label={rating.strictness} 
                                size="small" 
                                color={getStrictnessColor(rating.strictness)}
                                variant="outlined"
                              />
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
                
                <Button 
                  fullWidth 
                  variant="outlined" 
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/my-ratings')}
                >
                  View All My Ratings
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Dashboard;