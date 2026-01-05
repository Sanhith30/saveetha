const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  facultyId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    enum: [
      'Computer Science and Engineering',
      'Information Technology',
      'Electronics and Communication Engineering',
      'Electrical and Electronics Engineering',
      'Mechanical Engineering',
      'Civil Engineering',
      'Biomedical Engineering',
      'Biotechnology',
      'Chemical Engineering'
    ]
  },
  subjects: [{
    type: String,
    required: true
  }],
  contactNumber: {
    type: String,
    required: true,
    match: /^[6-9]\d{9}$/ // Indian mobile number format
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  designation: {
    type: String,
    required: true,
    enum: ['Assistant Professor', 'Associate Professor', 'Professor', 'HOD']
  },
  experience: {
    type: Number,
    required: true,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Aggregated rating data (calculated from ratings)
  averageRating: {
    teachingQuality: { type: Number, default: 0 },
    explanationClarity: { type: Number, default: 0 },
    overallRating: { type: Number, default: 0 }
  },
  strictnessDistribution: {
    loose: { type: Number, default: 0 },
    moderate: { type: Number, default: 0 },
    strict: { type: Number, default: 0 }
  },
  marksDistribution: {
    range40_50: { type: Number, default: 0 },
    range50_60: { type: Number, default: 0 },
    range60_70: { type: Number, default: 0 }
  },
  friendlinessPercentage: {
    type: Number,
    default: 0
  },
  totalRatings: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient searching
facultySchema.index({ department: 1, subjects: 1 });
facultySchema.index({ name: 'text' });

module.exports = mongoose.model('Faculty', facultySchema);