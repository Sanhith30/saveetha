const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  subject: {
    type: String,
    required: true
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
  resourceType: {
    type: String,
    required: true,
    enum: ['Notes', 'PPT', 'Video', 'Link', 'Concept', 'Reference']
  },
  fileUrl: {
    type: String,
    required: function() {
      return this.resourceType !== 'Link';
    }
  },
  externalLink: {
    type: String,
    required: function() {
      return this.resourceType === 'Link';
    }
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  uploadedBy: {
    type: String,
    required: true,
    default: 'Admin'
  },
  tags: [{
    type: String,
    trim: true
  }],
  downloadCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  fileSize: {
    type: Number // in bytes
  },
  fileFormat: {
    type: String,
    enum: ['PDF', 'PPT', 'PPTX', 'DOC', 'DOCX', 'TXT', 'VIDEO', 'LINK']
  }
}, {
  timestamps: true
});

// Indexes for efficient searching
resourceSchema.index({ subject: 1, department: 1, semester: 1 });
resourceSchema.index({ resourceType: 1, isActive: 1 });
resourceSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Resource', resourceSchema);