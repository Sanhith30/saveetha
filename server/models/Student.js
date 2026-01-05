const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
  regNo: {
    type: String,
    required: true,
    unique: true,
    match: /^1923\d{5}$/, // Saveetha registration number format: 1923XXXXX
    uppercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
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
  year: {
    type: Number,
    required: true,
    min: 1,
    max: 4
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
studentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
studentSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
studentSchema.methods.toJSON = function() {
  const student = this.toObject();
  delete student.password;
  return student;
};

module.exports = mongoose.model('Student', studentSchema);