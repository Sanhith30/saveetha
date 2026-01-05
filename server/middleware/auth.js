const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Admin = require('../models/Admin');

// Verify JWT token and authenticate student
const authenticateStudent = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.type !== 'student') {
      return res.status(403).json({ message: 'Access denied. Student token required.' });
    }

    const student = await Student.findOne({ regNo: decoded.regNo, isActive: true });
    if (!student) {
      return res.status(401).json({ message: 'Invalid token. Student not found.' });
    }

    req.student = student;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired.' });
    }
    res.status(500).json({ message: 'Token verification failed.' });
  }
};

// Verify JWT token and authenticate admin
const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.type !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin token required.' });
    }

    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin || !admin.isActive) {
      return res.status(401).json({ message: 'Invalid token. Admin not found.' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired.' });
    }
    res.status(500).json({ message: 'Token verification failed.' });
  }
};

// Check admin permissions
const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({ message: 'Admin authentication required.' });
    }

    if (req.admin.role === 'super_admin' || req.admin.permissions.includes(permission)) {
      next();
    } else {
      res.status(403).json({ message: `Access denied. ${permission} permission required.` });
    }
  };
};

// Generate JWT token for student
const generateStudentToken = (student) => {
  return jwt.sign(
    { 
      regNo: student.regNo, 
      type: 'student',
      department: student.department 
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Generate JWT token for admin
const generateAdminToken = (admin) => {
  return jwt.sign(
    { 
      id: admin._id, 
      type: 'admin',
      role: admin.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

module.exports = {
  authenticateStudent,
  authenticateAdmin,
  checkPermission,
  generateStudentToken,
  generateAdminToken
};