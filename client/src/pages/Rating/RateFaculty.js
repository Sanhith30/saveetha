import React, { useState } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Rating,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { Star, Send, ArrowBack } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';

const steps = ['Faculty Info', 'Rate Teaching', 'Additional Details', 'Submit'];

const RateFaculty = () => {
  const { facultyId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeStep, setActiveStep] = useState(0);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      teachingQuality: 0,
      strictness: '',
      internalMarksRange: '',
      explanationClarity: 0,
      studentFriendliness: '',
      feedback: '',
      subject: '',
      semester: ''
    }
  });

  // Fetch faculty details
  const { data: faculty, isLoading: facultyLoading } = useQuery(
    ['faculty', facultyId],
    async () => {
      const response = await axios.get(`/api/faculty/${facultyId}`);
      return response.data;
    }
  );

  // Check if student can rate
  const { data: canRateData, isLoading: canRateLoading } = useQuery(
    ['canRate', facultyId],
    async () => {
      const response = await axios.get(`/api/ratings/can-rate/${facultyId}`);
      return response.data;
    }
  );

  // Submit rating mutation
  const submitRatingMutation = useMutation(
    async (ratingData) => {
      const response = await axios.post('/api/ratings', {
        ...ratingData,
        facultyId
      });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['faculty', facultyId]);
        queryClient.invalidateQueries(['canRate', facultyId]);
        toast.success('Rating submitted successfully!');
        navigate(`/faculty/${facultyId}`);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to submit rating');
      }
    }
  );

  const onSubmit = (data) => {
    const ratingData = {
      ...data,
      teachingQuality: parseInt(data.teachingQuality),
      explanationClarity: parseInt(data.explanationClarity),
      studentFriendliness: data.studentFriendliness === 'true',
      semester: parseInt(data.semester)
    };
    
    submitRatingMutation.mutate(ratingData);
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  if (facultyLoading || canRateLoading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!canRateData?.canRate) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          {canRateData?.alreadyRated 
            ? 'You have already rated this faculty. Each student can rate a faculty only once.'
            : 'You cannot rate this faculty at this time.'
          }
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate(`/faculty/${facultyId}`)}
        >
          Back to Faculty Details
        </Button>
      </Container>
    );
  }

  const renderStepContent = (step) => {
    const watchedValues = watch();

    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Faculty Information
            </Typography>
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6">{faculty.name}</Typography>
                <Typography color="text.secondary">{faculty.designation}</Typography>
                <Typography color="text.secondary">{faculty.department}</Typography>
              </CardContent>
            </Card>

            <Controller
              name="subject"
              control={control}
              rules={{ required: 'Subject is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="Subject"
                  error={!!errors.subject}
                  helperText={errors.subject?.message}
                  SelectProps={{ native: true }}
                  sx={{ mb: 2 }}
                >
                  <option value="">Select Subject</option>
                  {faculty.subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </TextField>
              )}
            />

            <Controller
              name="semester"
              control={control}
              rules={{ required: 'Semester is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="Semester"
                  error={!!errors.semester}
                  helperText={errors.semester?.message}
                  SelectProps={{ native: true }}
                >
                  <option value="">Select Semester</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </TextField>
              )}
            />
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Rate Teaching Quality
            </Typography>

            <Box sx={{ mb: 3 }}>
              <FormLabel component="legend">Teaching Quality *</FormLabel>
              <Controller
                name="teachingQuality"
                control={control}
                rules={{ required: 'Teaching quality rating is required', min: 1 }}
                render={({ field }) => (
                  <Rating
                    {...field}
                    value={parseInt(field.value) || 0}
                    onChange={(event, newValue) => field.onChange(newValue)}
                    size="large"
                    sx={{ mt: 1 }}
                  />
                )}
              />
              {errors.teachingQuality && (
                <Typography variant="caption" color="error">
                  {errors.teachingQuality.message}
                </Typography>
              )}
            </Box>

            <Box sx={{ mb: 3 }}>
              <FormLabel component="legend">Explanation Clarity *</FormLabel>
              <Controller
                name="explanationClarity"
                control={control}
                rules={{ required: 'Explanation clarity rating is required', min: 1 }}
                render={({ field }) => (
                  <Rating
                    {...field}
                    value={parseInt(field.value) || 0}
                    onChange={(event, newValue) => field.onChange(newValue)}
                    size="large"
                    sx={{ mt: 1 }}
                  />
                )}
              />
              {errors.explanationClarity && (
                <Typography variant="caption" color="error">
                  {errors.explanationClarity.message}
                </Typography>
              )}
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Additional Details
            </Typography>

            <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
              <FormLabel component="legend">Strictness Level *</FormLabel>
              <Controller
                name="strictness"
                control={control}
                rules={{ required: 'Strictness level is required' }}
                render={({ field }) => (
                  <RadioGroup {...field} row>
                    <FormControlLabel value="Loose" control={<Radio />} label="Loose" />
                    <FormControlLabel value="Moderate" control={<Radio />} label="Moderate" />
                    <FormControlLabel value="Strict" control={<Radio />} label="Strict" />
                  </RadioGroup>
                )}
              />
              {errors.strictness && (
                <Typography variant="caption" color="error">
                  {errors.strictness.message}
                </Typography>
              )}
            </FormControl>

            <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
              <FormLabel component="legend">Internal Marks Range *</FormLabel>
              <Controller
                name="internalMarksRange"
                control={control}
                rules={{ required: 'Internal marks range is required' }}
                render={({ field }) => (
                  <RadioGroup {...field} row>
                    <FormControlLabel value="40-50" control={<Radio />} label="40-50" />
                    <FormControlLabel value="50-60" control={<Radio />} label="50-60" />
                    <FormControlLabel value="60-70" control={<Radio />} label="60-70" />
                  </RadioGroup>
                )}
              />
              {errors.internalMarksRange && (
                <Typography variant="caption" color="error">
                  {errors.internalMarksRange.message}
                </Typography>
              )}
            </FormControl>

            <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
              <FormLabel component="legend">Student Friendliness *</FormLabel>
              <Controller
                name="studentFriendliness"
                control={control}
                rules={{ required: 'Student friendliness is required' }}
                render={({ field }) => (
                  <RadioGroup {...field} row>
                    <FormControlLabel value="true" control={<Radio />} label="Yes" />
                    <FormControlLabel value="false" control={<Radio />} label="No" />
                  </RadioGroup>
                )}
              />
              {errors.studentFriendliness && (
                <Typography variant="caption" color="error">
                  {errors.studentFriendliness.message}
                </Typography>
              )}
            </FormControl>

            <Controller
              name="feedback"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  rows={4}
                  label="Additional Feedback (Optional)"
                  placeholder="Share your experience with this faculty..."
                  inputProps={{ maxLength: 500 }}
                  helperText={`${field.value?.length || 0}/500 characters`}
                />
              )}
            />
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Your Rating
            </Typography>
            
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Faculty:</strong> {faculty.name}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Subject:</strong> {watchedValues.subject}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Semester:</strong> {watchedValues.semester}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Teaching Quality:</strong> {watchedValues.teachingQuality}/5 stars
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Explanation Clarity:</strong> {watchedValues.explanationClarity}/5 stars
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Strictness:</strong> {watchedValues.strictness}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Internal Marks Range:</strong> {watchedValues.internalMarksRange}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Student Friendly:</strong> {watchedValues.studentFriendliness === 'true' ? 'Yes' : 'No'}
                </Typography>
                {watchedValues.feedback && (
                  <Typography variant="body2">
                    <strong>Feedback:</strong> {watchedValues.feedback}
                  </Typography>
                )}
              </CardContent>
            </Card>

            <Alert severity="info" sx={{ mt: 2 }}>
              Your identity will remain anonymous. This rating will be aggregated with others to help fellow students.
            </Alert>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Star sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h4" fontWeight="bold">
              Rate Faculty
            </Typography>
          </Box>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <form onSubmit={handleSubmit(onSubmit)}>
            {renderStepContent(activeStep)}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                onClick={() => navigate(`/faculty/${facultyId}`)}
                startIcon={<ArrowBack />}
              >
                Cancel
              </Button>

              <Box>
                {activeStep > 0 && (
                  <Button onClick={handleBack} sx={{ mr: 1 }}>
                    Back
                  </Button>
                )}

                {activeStep < steps.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={
                      (activeStep === 0 && (!watch('subject') || !watch('semester'))) ||
                      (activeStep === 1 && (!watch('teachingQuality') || !watch('explanationClarity'))) ||
                      (activeStep === 2 && (!watch('strictness') || !watch('internalMarksRange') || !watch('studentFriendliness')))
                    }
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Send />}
                    disabled={submitRatingMutation.isLoading}
                  >
                    {submitRatingMutation.isLoading ? 'Submitting...' : 'Submit Rating'}
                  </Button>
                )}
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default RateFaculty;