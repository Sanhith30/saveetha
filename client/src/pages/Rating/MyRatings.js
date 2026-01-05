import React from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Grid,
  Rating,
  CircularProgress,
  Alert,
  Pagination
} from '@mui/material';
import { Star, School, CalendarToday } from '@mui/icons-material';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useState } from 'react';

const MyRatings = () => {
  const [page, setPage] = useState(1);

  // Fetch user's ratings
  const { data: ratingsData, isLoading, error } = useQuery(
    ['myRatings', page],
    async () => {
      const response = await axios.get(`/api/ratings/my-ratings?page=${page}&limit=10`);
      return response.data;
    }
  );

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const getStrictnessColor = (strictness) => {
    switch (strictness) {
      case 'Loose': return 'success';
      case 'Moderate': return 'warning';
      case 'Strict': return 'error';
      default: return 'default';
    }
  };

  const getMarksRangeColor = (range) => {
    switch (range) {
      case '60-70': return 'success';
      case '50-60': return 'warning';
      case '40-50': return 'error';
      default: return 'default';
    }
  };

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
          Failed to load your ratings. Please try again.
        </Alert>
      </Container>
    );
  }

  const ratings = ratingsData?.ratings || [];
  const pagination = ratingsData?.pagination || {};

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          My Faculty Ratings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View all the faculty ratings you have submitted
        </Typography>
      </Box>

      {ratings.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Star sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              No Ratings Yet
            </Typography>
            <Typography variant="body1" color="text.secondary">
              You haven't rated any faculty members yet. Start by browsing the faculty directory.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Ratings Grid */}
          <Grid container spacing={3}>
            {ratings.map((rating) => (
              <Grid item xs={12} md={6} key={rating._id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    {/* Faculty Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <School sx={{ mr: 1, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {rating.facultyId?.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {rating.facultyId?.department}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Subject and Semester */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Subject:</strong> {rating.subject}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Semester:</strong> {rating.semester}
                      </Typography>
                    </Box>

                    {/* Ratings */}
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" sx={{ mr: 1, minWidth: '140px' }}>
                          Teaching Quality:
                        </Typography>
                        <Rating value={rating.teachingQuality} readOnly size="small" />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {rating.teachingQuality}/5
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ mr: 1, minWidth: '140px' }}>
                          Explanation Clarity:
                        </Typography>
                        <Rating value={rating.explanationClarity} readOnly size="small" />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {rating.explanationClarity}/5
                        </Typography>
                      </Box>
                    </Box>

                    {/* Chips for other ratings */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      <Chip 
                        label={rating.strictness}
                        size="small"
                        color={getStrictnessColor(rating.strictness)}
                        variant="outlined"
                      />
                      <Chip 
                        label={`Marks: ${rating.internalMarksRange}`}
                        size="small"
                        color={getMarksRangeColor(rating.internalMarksRange)}
                        variant="outlined"
                      />
                      <Chip 
                        label={rating.studentFriendliness ? 'Friendly' : 'Not Friendly'}
                        size="small"
                        color={rating.studentFriendliness ? 'success' : 'default'}
                        variant="outlined"
                      />
                    </Box>

                    {/* Feedback */}
                    {rating.feedback && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          <strong>Your Feedback:</strong>
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          fontStyle: 'italic',
                          backgroundColor: 'grey.50',
                          p: 1,
                          borderRadius: 1,
                          border: '1px solid',
                          borderColor: 'grey.200'
                        }}>
                          "{rating.feedback}"
                        </Typography>
                      </Box>
                    )}

                    {/* Date */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                      <CalendarToday sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        Rated on {new Date(rating.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Typography>
                    </Box>

                    {/* Verification Status */}
                    <Box sx={{ mt: 1 }}>
                      <Chip 
                        label={rating.isVerified ? 'Verified' : 'Pending Verification'}
                        size="small"
                        color={rating.isVerified ? 'success' : 'warning'}
                        variant="filled"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={pagination.totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}

          {/* Summary */}
          <Card sx={{ mt: 4, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Rating Summary
              </Typography>
              <Typography variant="body2">
                You have submitted <strong>{pagination.totalRatings || ratings.length}</strong> faculty ratings.
                Your feedback helps fellow students make informed decisions during faculty selection.
              </Typography>
            </CardContent>
          </Card>
        </>
      )}
    </Container>
  );
};

export default MyRatings;