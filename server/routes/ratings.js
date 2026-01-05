const express = require('express');
const { body, validationResult } = require('express-validator');
const Rating = require('../models/Rating');
const Faculty = require('../models/Faculty');
const { authenticateStudent } = require('../middleware/auth');

const router = express.Router();

// Submit a rating
router.post('/', [
  authenticateStudent,
  body('facultyId').isMongoId().withMessage('Valid faculty ID is required'),
  body('teachingQuality').isInt({ min: 1, max: 5 }).withMessage('Teaching quality must be 1-5'),
  body('strictness').isIn(['Loose', 'Moderate', 'Strict']).withMessage('Invalid strictness value'),
  body('internalMarksRange').isIn(['40-50', '50-60', '60-70']).withMessage('Invalid marks range'),
  body('explanationClarity').isInt({ min: 1, max: 5 }).withMessage('Explanation clarity must be 1-5'),
  body('studentFriendliness').isBoolean().withMessage('Student friendliness must be true/false'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('semester').isInt({ min: 1, max: 8 }).withMessage('Semester must be 1-8'),
  body('feedback').optional().isLength({ max: 500 }).withMessage('Feedback must be max 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const {
      facultyId,
      teachingQuality,
      strictness,
      internalMarksRange,
      explanationClarity,
      studentFriendliness,
      feedback,
      subject,
      semester
    } = req.body;

    // Check if faculty exists
    const faculty = await Faculty.findById(facultyId);
    if (!faculty || !faculty.isActive) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    // Check if student has already rated this faculty
    const existingRating = await Rating.findOne({
      studentRegNo: req.student.regNo,
      facultyId
    });

    if (existingRating) {
      return res.status(409).json({ 
        message: 'You have already rated this faculty. Each student can rate a faculty only once.' 
      });
    }

    // Create new rating
    const rating = new Rating({
      studentRegNo: req.student.regNo,
      facultyId,
      teachingQuality,
      strictness,
      internalMarksRange,
      explanationClarity,
      studentFriendliness,
      feedback: feedback?.trim(),
      subject,
      semester
    });

    await rating.save();

    // Update faculty aggregated ratings
    await updateFacultyRatings(facultyId);

    res.status(201).json({
      message: 'Rating submitted successfully',
      rating: {
        id: rating._id,
        facultyId: rating.facultyId,
        subject: rating.subject,
        createdAt: rating.createdAt
      }
    });

  } catch (error) {
    console.error('Rating submission error:', error);
    res.status(500).json({ message: 'Failed to submit rating' });
  }
});

// Get student's ratings
router.get('/my-ratings', authenticateStudent, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const ratings = await Rating.find({ 
      studentRegNo: req.student.regNo 
    })
    .populate('facultyId', 'name department subjects')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

    const total = await Rating.countDocuments({ 
      studentRegNo: req.student.regNo 
    });

    res.json({
      ratings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalRatings: total
      }
    });

  } catch (error) {
    console.error('My ratings fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch your ratings' });
  }
});

// Check if student can rate a faculty
router.get('/can-rate/:facultyId', authenticateStudent, async (req, res) => {
  try {
    const { facultyId } = req.params;

    // Check if faculty exists
    const faculty = await Faculty.findById(facultyId);
    if (!faculty || !faculty.isActive) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    // Check if already rated
    const existingRating = await Rating.findOne({
      studentRegNo: req.student.regNo,
      facultyId
    });

    res.json({
      canRate: !existingRating,
      alreadyRated: !!existingRating,
      facultyName: faculty.name
    });

  } catch (error) {
    console.error('Can rate check error:', error);
    res.status(500).json({ message: 'Failed to check rating eligibility' });
  }
});

// Get faculty rating statistics (for display)
router.get('/stats/:facultyId', authenticateStudent, async (req, res) => {
  try {
    const { facultyId } = req.params;

    const faculty = await Faculty.findById(facultyId);
    if (!faculty || !faculty.isActive) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    // Only show stats if minimum threshold is met
    if (faculty.totalRatings < 3) {
      return res.json({
        message: 'Insufficient ratings to display statistics',
        totalRatings: faculty.totalRatings,
        minimumRequired: 3,
        showStats: false
      });
    }

    res.json({
      facultyName: faculty.name,
      department: faculty.department,
      totalRatings: faculty.totalRatings,
      averageRating: faculty.averageRating,
      strictnessDistribution: faculty.strictnessDistribution,
      marksDistribution: faculty.marksDistribution,
      friendlinessPercentage: faculty.friendlinessPercentage,
      showStats: true
    });

  } catch (error) {
    console.error('Rating stats error:', error);
    res.status(500).json({ message: 'Failed to fetch rating statistics' });
  }
});

// Helper function to update faculty aggregated ratings
async function updateFacultyRatings(facultyId) {
  try {
    const ratings = await Rating.find({ 
      facultyId, 
      isVerified: true 
    });

    if (ratings.length === 0) return;

    // Calculate averages
    const teachingQualityAvg = ratings.reduce((sum, r) => sum + r.teachingQuality, 0) / ratings.length;
    const explanationClarityAvg = ratings.reduce((sum, r) => sum + r.explanationClarity, 0) / ratings.length;
    const overallRating = (teachingQualityAvg + explanationClarityAvg) / 2;

    // Calculate strictness distribution
    const strictnessCount = ratings.reduce((acc, r) => {
      acc[r.strictness.toLowerCase()] = (acc[r.strictness.toLowerCase()] || 0) + 1;
      return acc;
    }, {});

    const strictnessDistribution = {
      loose: ((strictnessCount.loose || 0) / ratings.length * 100).toFixed(1),
      moderate: ((strictnessCount.moderate || 0) / ratings.length * 100).toFixed(1),
      strict: ((strictnessCount.strict || 0) / ratings.length * 100).toFixed(1)
    };

    // Calculate marks distribution
    const marksCount = ratings.reduce((acc, r) => {
      const key = `range${r.internalMarksRange.replace('-', '_')}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const marksDistribution = {
      range40_50: ((marksCount.range40_50 || 0) / ratings.length * 100).toFixed(1),
      range50_60: ((marksCount.range50_60 || 0) / ratings.length * 100).toFixed(1),
      range60_70: ((marksCount.range60_70 || 0) / ratings.length * 100).toFixed(1)
    };

    // Calculate friendliness percentage
    const friendlyCount = ratings.filter(r => r.studentFriendliness).length;
    const friendlinessPercentage = ((friendlyCount / ratings.length) * 100).toFixed(1);

    // Update faculty document
    await Faculty.findByIdAndUpdate(facultyId, {
      averageRating: {
        teachingQuality: parseFloat(teachingQualityAvg.toFixed(2)),
        explanationClarity: parseFloat(explanationClarityAvg.toFixed(2)),
        overallRating: parseFloat(overallRating.toFixed(2))
      },
      strictnessDistribution,
      marksDistribution,
      friendlinessPercentage: parseFloat(friendlinessPercentage),
      totalRatings: ratings.length
    });

  } catch (error) {
    console.error('Update faculty ratings error:', error);
  }
}

module.exports = router;