import React from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Grid,
  Rating,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Star,
  Phone,
  Email,
  School,
  Work,
  Assessment
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';

const FacultyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch faculty details
  const { data: faculty, isLoading, error } = useQuery(
    ['faculty', id],
    async () => {
      const response = await axios.get(`/api/faculty/${id}`);
      return response.data;
    }
  );

  // Check if student can rate this faculty
  const { data: canRateData } = useQuery(
    ['canRate', id],
    async () => {
      const response = await axios.get(`/api/ratings/can-rate/${id}`);
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

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          Failed to load faculty details. Please try again.
        </Alert>
      </Container>
    );
  }

  const showRatings = faculty.totalRatings >= 3;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header Card */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <School sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {faculty.name}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    {faculty.designation}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body1" color="text.secondary" gutterBottom>
                {faculty.department}
              </Typography>

              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Subjects Taught:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {faculty.subjects.map((subject, index) => (
                    <Chip 
                      key={index}
                      label={subject} 
                      variant="outlined"
                      color="primary"
                    />
                  ))}
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Contact Information
                  </Typography>
                  
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <Phone color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Phone"
                        secondary={faculty.contactNumber}
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <Email color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Email"
                        secondary={faculty.email}
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <Work color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Experience"
                        secondary={`${faculty.experience} years`}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<Star />}
              onClick={() => navigate(`/rate/${faculty._id}`)}
              disabled={!canRateData?.canRate}
            >
              {canRateData?.alreadyRated ? 'Already Rated' : 'Rate This Faculty'}
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/faculty')}
            >
              Back to Faculty List
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Ratings Section */}
      <Grid container spacing={4}>
        {showRatings ? (
          <>
            {/* Overall Rating */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Overall Rating
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h3" fontWeight="bold" sx={{ mr: 2 }}>
                      {faculty.averageRating.overallRating.toFixed(1)}
                    </Typography>
                    <Box>
                      <Rating 
                        value={faculty.averageRating.overallRating} 
                        readOnly 
                        precision={0.1}
                        size="large"
                      />
                      <Typography variant="body2" color="text.secondary">
                        Based on {faculty.totalRatings} ratings
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Teaching Quality</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {faculty.averageRating.teachingQuality.toFixed(1)}/5
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={(faculty.averageRating.teachingQuality / 5) * 100}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Explanation Clarity</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {faculty.averageRating.explanationClarity.toFixed(1)}/5
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={(faculty.averageRating.explanationClarity / 5) * 100}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Strictness Distribution */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Strictness Distribution
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Loose</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {faculty.strictnessDistribution.loose}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={parseFloat(faculty.strictnessDistribution.loose)}
                      color="success"
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Moderate</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {faculty.strictnessDistribution.moderate}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={parseFloat(faculty.strictnessDistribution.moderate)}
                      color="warning"
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Strict</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {faculty.strictnessDistribution.strict}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={parseFloat(faculty.strictnessDistribution.strict)}
                      color="error"
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Internal Marks Distribution */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Internal Marks Distribution
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">60-70 Range</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {faculty.marksDistribution.range60_70}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={parseFloat(faculty.marksDistribution.range60_70)}
                      color="success"
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">50-60 Range</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {faculty.marksDistribution.range50_60}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={parseFloat(faculty.marksDistribution.range50_60)}
                      color="warning"
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">40-50 Range</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {faculty.marksDistribution.range40_50}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={parseFloat(faculty.marksDistribution.range40_50)}
                      color="error"
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Student Friendliness */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Student Friendliness
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h3" fontWeight="bold" sx={{ mr: 2 }}>
                      {faculty.friendlinessPercentage}%
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      of students find this faculty friendly
                    </Typography>
                  </Box>

                  <LinearProgress 
                    variant="determinate" 
                    value={parseFloat(faculty.friendlinessPercentage)}
                    color={parseFloat(faculty.friendlinessPercentage) > 70 ? 'success' : 
                           parseFloat(faculty.friendlinessPercentage) > 40 ? 'warning' : 'error'}
                    sx={{ height: 12, borderRadius: 6 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          </>
        ) : (
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <Assessment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Not Enough Ratings Yet
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  This faculty needs at least 3 ratings before detailed statistics can be displayed.
                  Current ratings: {faculty.totalRatings}
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Star />}
                  onClick={() => navigate(`/rate/${faculty._id}`)}
                  disabled={!canRateData?.canRate}
                >
                  {canRateData?.alreadyRated ? 'You Already Rated' : 'Be the First to Rate'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Disclaimer */}
      <Card sx={{ mt: 4, bgcolor: 'info.light', color: 'info.contrastText' }}>
        <CardContent>
          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
            <strong>Disclaimer:</strong> All ratings are based on student experiences and are shown as aggregated data only. 
            Individual student identities are kept anonymous. This information is meant to help students make informed decisions 
            during faculty selection.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default FacultyDetail;