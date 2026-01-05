const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  studentRegNo: {
    type: String,
    required: true,
    ref: 'Student'
  },
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Faculty'
  },
  teachingQuality: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  strictness: {
    type: String,
    required: true,
    enum: ['Loose', 'Moderate', 'Strict']
  },
  internalMarksRange: {
    type: String,
    required: true,
    enum: ['40-50', '50-60', '60-70']
  },
  explanationClarity: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  studentFriendliness: {
    type: Boolean,
    required: true
  },
  feedback: {
    type: String,
    maxlength: 500,
    trim: true
  },
  subject: {
    type: String,
    required: true
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  isVerified: {
    type: Boolean,
    default: true
  },
  isReported: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound index to ensure one rating per student per faculty
ratingSchema.index({ studentRegNo: 1, facultyId: 1 }, { unique: true });

// Index for efficient aggregation queries
ratingSchema.index({ facultyId: 1, isVerified: 1 });

module.exports = mongoose.model('Rating', ratingSchema);