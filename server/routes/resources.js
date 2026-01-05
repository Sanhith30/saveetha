const express = require('express');
const Resource = require('../models/Resource');
const { authenticateStudent } = require('../middleware/auth');

const router = express.Router();

// Get all resources with filters
router.get('/', authenticateStudent, async (req, res) => {
  try {
    const {
      department,
      subject,
      semester,
      resourceType,
      search,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

    if (department) {
      filter.department = department;
    }

    if (subject) {
      filter.subject = { $regex: subject, $options: 'i' };
    }

    if (semester) {
      filter.semester = parseInt(semester);
    }

    if (resourceType) {
      filter.resourceType = resourceType;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort object
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const resources = await Resource.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    const total = await Resource.countDocuments(filter);

    res.json({
      resources,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalResources: total,
        hasNext: skip + resources.length < total,
        hasPrev: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Resources fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch resources' });
  }
});

// Get resource by ID
router.get('/:id', authenticateStudent, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource || !resource.isActive) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Increment download count
    resource.downloadCount += 1;
    await resource.save();

    res.json(resource);

  } catch (error) {
    console.error('Resource fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch resource' });
  }
});

// Get resources by subject
router.get('/subject/:subject', authenticateStudent, async (req, res) => {
  try {
    const { subject } = req.params;
    const { department, semester, resourceType, limit = 50 } = req.query;

    const filter = {
      isActive: true,
      subject: { $regex: subject, $options: 'i' }
    };

    if (department) {
      filter.department = department;
    }

    if (semester) {
      filter.semester = parseInt(semester);
    }

    if (resourceType) {
      filter.resourceType = resourceType;
    }

    const resources = await Resource.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select('-__v');

    res.json({ resources });

  } catch (error) {
    console.error('Subject resources fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch subject resources' });
  }
});

// Get popular resources
router.get('/popular/top', authenticateStudent, async (req, res) => {
  try {
    const { department, limit = 10 } = req.query;

    const filter = { isActive: true };
    if (department) {
      filter.department = department;
    }

    const resources = await Resource.find(filter)
      .sort({ downloadCount: -1 })
      .limit(parseInt(limit))
      .select('title description subject resourceType downloadCount createdAt');

    res.json({ resources });

  } catch (error) {
    console.error('Popular resources fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch popular resources' });
  }
});

// Get recent resources
router.get('/recent/latest', authenticateStudent, async (req, res) => {
  try {
    const { department, limit = 10 } = req.query;

    const filter = { isActive: true };
    if (department) {
      filter.department = department;
    }

    const resources = await Resource.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select('title description subject resourceType downloadCount createdAt');

    res.json({ resources });

  } catch (error) {
    console.error('Recent resources fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch recent resources' });
  }
});

// Get resource metadata (subjects, types, etc.)
router.get('/meta/subjects', authenticateStudent, async (req, res) => {
  try {
    const { department } = req.query;
    
    const filter = { isActive: true };
    if (department) {
      filter.department = department;
    }

    const subjects = await Resource.distinct('subject', filter);
    res.json({ subjects: subjects.sort() });

  } catch (error) {
    console.error('Subjects fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch subjects' });
  }
});

// Get resource types
router.get('/meta/types', authenticateStudent, async (req, res) => {
  try {
    const types = await Resource.distinct('resourceType', { isActive: true });
    res.json({ types: types.sort() });

  } catch (error) {
    console.error('Resource types fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch resource types' });
  }
});

// Get departments with resource count
router.get('/meta/departments', authenticateStudent, async (req, res) => {
  try {
    const departments = await Resource.aggregate([
      { $match: { isActive: true } },
      { 
        $group: { 
          _id: '$department', 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({ departments });

  } catch (error) {
    console.error('Departments fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch departments' });
  }
});

// Search resources
router.get('/search/:query', authenticateStudent, async (req, res) => {
  try {
    const { query } = req.params;
    const { department, resourceType, limit = 20 } = req.query;

    const searchFilter = {
      isActive: true,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { subject: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ]
    };

    if (department) {
      searchFilter.department = department;
    }

    if (resourceType) {
      searchFilter.resourceType = resourceType;
    }

    const resources = await Resource.find(searchFilter)
      .limit(parseInt(limit))
      .sort({ downloadCount: -1, createdAt: -1 })
      .select('-__v');

    res.json({ resources });

  } catch (error) {
    console.error('Resource search error:', error);
    res.status(500).json({ message: 'Search failed' });
  }
});

module.exports = router;