const express = require('express');
const { body, validationResult } = require('express-validator');
const Faculty = require('../models/Faculty');
const Resource = require('../models/Resource');
const Rating = require('../models/Rating');
const Student = require('../models/Student');
const Admin = require('../models/Admin');
const { authenticateAdmin, checkPermission } = require('../middleware/auth');

const router = express.Router();

// Admin Dashboard Stats
router.get('/dashboard', authenticateAdmin, async (req, res) => {
  try {
    const [
      totalStudents,
      totalFaculty,
      totalResources,
      totalRatings,
      recentRatings,
      topRatedFaculty
    ] = await Promise.all([
      Student.countDocuments({ isActive: true }),
      Faculty.countDocuments({ isActive: true }),
      Resource.countDocuments({ isActive: true }),
      Rating.countDocuments({ isVerified: true }),
      Rating.find({ isVerified: true })
        .populate('facultyId', 'name department')
        .sort({ createdAt: -1 })
        .limit(5),
      Faculty.find({ isActive: true, totalRatings: { $gte: 3 } })
        .sort({ 'averageRating.overallRating': -1 })
        .limit(5)
        .select('name department averageRating totalRatings')
    ]);

    res.json({
      stats: {
        totalStudents,
        totalFaculty,
        totalResources,
        totalRatings
      },
      recentRatings,
      topRatedFaculty
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
});

// Faculty Management
router.post('/faculty', [
  authenticateAdmin,
  checkPermission('manage_faculty'),
  body('facultyId').notEmpty().withMessage('Faculty ID is required'),
  body('name').notEmpty().withMessage('Name is required'),
  body('department').notEmpty().withMessage('Department is required'),
  body('subjects').isArray({ min: 1 }).withMessage('At least one subject is required'),
  body('contactNumber').matches(/^[6-9]\d{9}$/).withMessage('Valid contact number required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('designation').notEmpty().withMessage('Designation is required'),
  body('experience').isInt({ min: 0 }).withMessage('Valid experience required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const facultyData = req.body;
    facultyData.facultyId = facultyData.facultyId.toUpperCase();

    // Check if faculty ID already exists
    const existingFaculty = await Faculty.findOne({ 
      facultyId: facultyData.facultyId 
    });

    if (existingFaculty) {
      return res.status(409).json({ 
        message: 'Faculty with this ID already exists' 
      });
    }

    const faculty = new Faculty(facultyData);
    await faculty.save();

    res.status(201).json({
      message: 'Faculty added successfully',
      faculty
    });

  } catch (error) {
    console.error('Add faculty error:', error);
    res.status(500).json({ message: 'Failed to add faculty' });
  }
});

// Update Faculty
router.put('/faculty/:id', [
  authenticateAdmin,
  checkPermission('manage_faculty')
], async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    res.json({
      message: 'Faculty updated successfully',
      faculty
    });

  } catch (error) {
    console.error('Update faculty error:', error);
    res.status(500).json({ message: 'Failed to update faculty' });
  }
});

// Delete Faculty
router.delete('/faculty/:id', [
  authenticateAdmin,
  checkPermission('manage_faculty')
], async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    res.json({ message: 'Faculty deactivated successfully' });

  } catch (error) {
    console.error('Delete faculty error:', error);
    res.status(500).json({ message: 'Failed to delete faculty' });
  }
});

// Resource Management
router.post('/resources', [
  authenticateAdmin,
  checkPermission('manage_resources'),
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('department').notEmpty().withMessage('Department is required'),
  body('resourceType').notEmpty().withMessage('Resource type is required'),
  body('semester').isInt({ min: 1, max: 8 }).withMessage('Valid semester required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const resourceData = {
      ...req.body,
      uploadedBy: req.admin.name
    };

    const resource = new Resource(resourceData);
    await resource.save();

    res.status(201).json({
      message: 'Resource added successfully',
      resource
    });

  } catch (error) {
    console.error('Add resource error:', error);
    res.status(500).json({ message: 'Failed to add resource' });
  }
});

// Update Resource
router.put('/resources/:id', [
  authenticateAdmin,
  checkPermission('manage_resources')
], async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.json({
      message: 'Resource updated successfully',
      resource
    });

  } catch (error) {
    console.error('Update resource error:', error);
    res.status(500).json({ message: 'Failed to update resource' });
  }
});

// Delete Resource
router.delete('/resources/:id', [
  authenticateAdmin,
  checkPermission('manage_resources')
], async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.json({ message: 'Resource deactivated successfully' });

  } catch (error) {
    console.error('Delete resource error:', error);
    res.status(500).json({ message: 'Failed to delete resource' });
  }
});

// Rating Moderation
router.get('/ratings', [
  authenticateAdmin,
  checkPermission('moderate_ratings')
], async (req, res) => {
  try {
    const { page = 1, limit = 20, reported = false } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (reported === 'true') {
      filter.isReported = true;
    }

    const ratings = await Rating.find(filter)
      .populate('facultyId', 'name department')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Rating.countDocuments(filter);

    res.json({
      ratings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalRatings: total
      }
    });

  } catch (error) {
    console.error('Ratings fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch ratings' });
  }
});

// Verify/Unverify Rating
router.put('/ratings/:id/verify', [
  authenticateAdmin,
  checkPermission('moderate_ratings')
], async (req, res) => {
  try {
    const { isVerified } = req.body;
    
    const rating = await Rating.findByIdAndUpdate(
      req.params.id,
      { isVerified },
      { new: true }
    );

    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    // Update faculty aggregated ratings
    await updateFacultyRatings(rating.facultyId);

    res.json({
      message: `Rating ${isVerified ? 'verified' : 'unverified'} successfully`,
      rating
    });

  } catch (error) {
    console.error('Rating verification error:', error);
    res.status(500).json({ message: 'Failed to update rating verification' });
  }
});

// Student Management
router.get('/students', [
  authenticateAdmin,
  checkPermission('manage_students')
], async (req, res) => {
  try {
    const { page = 1, limit = 20, department, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (department) {
      filter.department = department;
    }
    if (search) {
      filter.regNo = { $regex: search, $options: 'i' };
    }

    const students = await Student.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Student.countDocuments(filter);

    res.json({
      students,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalStudents: total
      }
    });

  } catch (error) {
    console.error('Students fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch students' });
  }
});

// Analytics
router.get('/analytics', [
  authenticateAdmin,
  checkPermission('view_analytics')
], async (req, res) => {
  try {
    const [
      departmentStats,
      ratingTrends,
      resourceStats
    ] = await Promise.all([
      // Department-wise student and faculty count
      Student.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$department', studentCount: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),
      
      // Rating trends over time
      Rating.aggregate([
        { $match: { isVerified: true } },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 },
            avgTeachingQuality: { $avg: '$teachingQuality' },
            avgExplanationClarity: { $avg: '$explanationClarity' }
          }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 12 }
      ]),

      // Resource download stats
      Resource.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: '$resourceType',
            count: { $sum: 1 },
            totalDownloads: { $sum: '$downloadCount' }
          }
        },
        { $sort: { count: -1 } }
      ])
    ]);

    res.json({
      departmentStats,
      ratingTrends,
      resourceStats
    });

  } catch (error) {
    console.error('Analytics fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
});

// Helper function (same as in ratings.js)
async function updateFacultyRatings(facultyId) {
  try {
    const ratings = await Rating.find({ 
      facultyId, 
      isVerified: true 
    });

    if (ratings.length === 0) return;

    const teachingQualityAvg = ratings.reduce((sum, r) => sum + r.teachingQuality, 0) / ratings.length;
    const explanationClarityAvg = ratings.reduce((sum, r) => sum + r.explanationClarity, 0) / ratings.length;
    const overallRating = (teachingQualityAvg + explanationClarityAvg) / 2;

    const strictnessCount = ratings.reduce((acc, r) => {
      acc[r.strictness.toLowerCase()] = (acc[r.strictness.toLowerCase()] || 0) + 1;
      return acc;
    }, {});

    const strictnessDistribution = {
      loose: ((strictnessCount.loose || 0) / ratings.length * 100).toFixed(1),
      moderate: ((strictnessCount.moderate || 0) / ratings.length * 100).toFixed(1),
      strict: ((strictnessCount.strict || 0) / ratings.length * 100).toFixed(1)
    };

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

    const friendlyCount = ratings.filter(r => r.studentFriendliness).length;
    const friendlinessPercentage = ((friendlyCount / ratings.length) * 100).toFixed(1);

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