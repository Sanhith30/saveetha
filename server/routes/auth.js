const express = require('express');
const { body, validationResult } = require('express-validator');
const Student = require('../models/Student');
const Admin = require('../models/Admin');
const { generateStudentToken, generateAdminToken, authenticateStudent } = require('../middleware/auth');

const router = express.Router();

// Student Registration
router.post('/register', [
  body('regNo')
    .matches(/^1923\d{5}$/)
    .withMessage('Invalid registration number format. Must be 1923xxxxx'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('department')
    .notEmpty()
    .withMessage('Department is required'),
  body('year')
    .isInt({ min: 1, max: 4 })
    .withMessage('Year must be between 1 and 4')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { regNo, password, department, year } = req.body;

    // Check if student already exists
    const existingStudent = await Student.findOne({ regNo: regNo.toUpperCase() });
    if (existingStudent) {
      return res.status(409).json({ 
        message: 'Student with this registration number already exists' 
      });
    }

    // Create new student
    const student = new Student({
      regNo: regNo.toUpperCase(),
      password,
      department,
      year
    });

    await student.save();

    // Generate token
    const token = generateStudentToken(student);

    res.status(201).json({
      message: 'Student registered successfully',
      token,
      student: {
        regNo: student.regNo,
        department: student.department,
        year: student.year
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
});

// Student Login
router.post('/login', [
  body('regNo')
    .matches(/^1923\d{5}$/)
    .withMessage('Invalid registration number format'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { regNo, password } = req.body;

    // Find student
    const student = await Student.findOne({ 
      regNo: regNo.toUpperCase(), 
      isActive: true 
    });

    if (!student) {
      return res.status(401).json({ 
        message: 'Invalid registration number or password' 
      });
    }

    // Check password
    const isPasswordValid = await student.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Invalid registration number or password' 
      });
    }

    // Update last login
    student.lastLogin = new Date();
    await student.save();

    // Generate token
    const token = generateStudentToken(student);

    res.json({
      message: 'Login successful',
      token,
      student: {
        regNo: student.regNo,
        department: student.department,
        year: student.year,
        lastLogin: student.lastLogin
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
});

// Admin Login
router.post('/admin/login', [
  body('email')
    .isEmail()
    .withMessage('Valid email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    // Find admin
    const admin = await Admin.findOne({ 
      email: email.toLowerCase(), 
      isActive: true 
    });

    if (!admin) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token
    const token = generateAdminToken(admin);

    res.json({
      message: 'Admin login successful',
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        permissions: admin.permissions
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
});

// Get current student profile
router.get('/profile', authenticateStudent, async (req, res) => {
  try {
    res.json({
      student: {
        regNo: req.student.regNo,
        department: req.student.department,
        year: req.student.year,
        lastLogin: req.student.lastLogin,
        createdAt: req.student.createdAt
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

// Change password
router.put('/change-password', [
  authenticateStudent,
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Verify current password
    const isCurrentPasswordValid = await req.student.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    req.student.password = newPassword;
    await req.student.save();

    res.json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ message: 'Failed to change password' });
  }
});

module.exports = router;