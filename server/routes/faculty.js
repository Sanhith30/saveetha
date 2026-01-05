const express = require('express');
const Faculty = require('../models/Faculty');
const { authenticateStudent } = require('../middleware/auth');

const router = express.Router();

// Get all faculty with filters
router.get('/', authenticateStudent, async (req, res) => {
  try {
    const { 
      department, 
      subject, 
      sortBy = 'name', 
      sortOrder = 'asc',
      page = 1,
      limit = 20
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (department) {
      filter.department = department;
    }
    
    if (subject) {
      filter.subjects = { $in: [new RegExp(subject, 'i')] };
    }

    // Build sort object
    const sortOptions = {};
    if (sortBy === 'rating') {
      sortOptions['averageRating.overallRating'] = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'strictness') {
      sortOptions['strictnessDistribution.loose'] = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'marks') {
      sortOptions['marksDistribution.range60_70'] = sortOrder === 'desc' ? -1 : 1;
    } else {
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const faculty = await Faculty.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    const total = await Faculty.countDocuments(filter);

    res.json({
      faculty,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalFaculty: total,
        hasNext: skip + faculty.length < total,
        hasPrev: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Faculty fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch faculty data' });
  }
});

// Get faculty by ID with detailed ratings
router.get('/:id', authenticateStudent, async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id)
      .select('-__v');

    if (!faculty || !faculty.isActive) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    // Only show detailed ratings if minimum threshold is met
    const showDetailedRatings = faculty.totalRatings >= 3;

    const response = {
      ...faculty.toObject(),
      showDetailedRatings,
      ratingThresholdMet: showDetailedRatings
    };

    if (!showDetailedRatings) {
      response.averageRating = {
        teachingQuality: 0,
        explanationClarity: 0,
        overallRating: 0
      };
      response.strictnessDistribution = {
        loose: 0,
        moderate: 0,
        strict: 0
      };
      response.marksDistribution = {
        range40_50: 0,
        range50_60: 0,
        range60_70: 0
      };
      response.friendlinessPercentage = 0;
    }

    res.json(response);

  } catch (error) {
    console.error('Faculty detail fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch faculty details' });
  }
});

// Search faculty by name or subject
router.get('/search/:query', authenticateStudent, async (req, res) => {
  try {
    const { query } = req.params;
    const { department, limit = 10 } = req.query;

    const searchFilter = {
      isActive: true,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { subjects: { $in: [new RegExp(query, 'i')] } }
      ]
    };

    if (department) {
      searchFilter.department = department;
    }

    const faculty = await Faculty.find(searchFilter)
      .limit(parseInt(limit))
      .select('name department subjects averageRating totalRatings')
      .sort({ 'averageRating.overallRating': -1 });

    res.json({ faculty });

  } catch (error) {
    console.error('Faculty search error:', error);
    res.status(500).json({ message: 'Search failed' });
  }
});

// Get departments list
router.get('/meta/departments', authenticateStudent, async (req, res) => {
  try {
    const departments = await Faculty.distinct('department', { isActive: true });
    res.json({ departments });
  } catch (error) {
    console.error('Departments fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch departments' });
  }
});

// Get subjects list by department
router.get('/meta/subjects/:department', authenticateStudent, async (req, res) => {
  try {
    const { department } = req.params;
    
    const faculty = await Faculty.find({ 
      department, 
      isActive: true 
    }).select('subjects');

    const subjects = [...new Set(faculty.flatMap(f => f.subjects))].sort();
    
    res.json({ subjects });
  } catch (error) {
    console.error('Subjects fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch subjects' });
  }
});

module.exports = router;