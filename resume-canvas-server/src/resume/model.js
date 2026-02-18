import mongoose from 'mongoose';

const blockSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['text', 'heading', 'list', 'divider']
  },
  pageId: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  w: { type: Number, required: true },
  h: { type: Number, required: true },
  style: {
    fontSize: Number,
    fontWeight: Number,
    color: String,
    align: { type: String, enum: ['left', 'center', 'right'] },
    lineHeight: Number,
    letterSpacing: String,
    fontStyle: String
  },
  content: mongoose.Schema.Types.Mixed // Can be string or array
}, { _id: false });

const pageSchema = new mongoose.Schema({
  id: { type: String, required: true },
  width: { type: Number, default: 794 },
  height: { type: Number, default: 1123 }
}, { _id: false });

const experienceSchema = new mongoose.Schema({
  id: { type: String, required: true },
  company: { type: String, required: true },
  position: { type: String, required: true },
  location: String,
  startDate: String,
  endDate: String,
  description: String
}, { _id: false });

const skillSchema = new mongoose.Schema({
  id: { type: String, required: true },
  category: { type: String, required: true },
  items: { type: String, required: true }
}, { _id: false });

const educationSchema = new mongoose.Schema({
  id: { type: String, required: true },
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  location: String,
  startDate: String,
  endDate: String,
  gpa: String
}, { _id: false });

const achievementSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: String
}, { _id: false });

const projectSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  link: String,
  description: String,
  tech: String
}, { _id: false });

const resumeSchema = new mongoose.Schema({
  // User info (for future authentication)
  userId: {
    type: String,
    required: false, // Make optional for now
    index: true
  },

  // Resume metadata
  title: {
    type: String,
    default: function() {
      return `Resume - ${this.resumeData?.fullName || 'Untitled'}`;
    }
  },
  
  // Pages
  pages: {
    type: [pageSchema],
    default: [{ id: 'page-1', width: 794, height: 1123 }]
  },

  currentPageId: {
    type: String,
    default: 'page-1'
  },

  // Blocks (canvas elements)
  blocks: {
    type: [blockSchema],
    default: []
  },

  // Resume data
  resumeData: {
    fullName: { type: String, default: 'Your Name' },
    headline: { type: String, default: 'Your Professional Headline' },
    email: { type: String, default: 'you@email.com' },
    phone: { type: String, default: '+1 (555) 000-0000' },
    location: { type: String, default: 'City, Country' },
    summary: { type: String, default: 'Your professional summary...' },
    github: String,
    linkedin: String,
    portfolio: String
  },

  // Sections
  sections: {
    experience: {
      type: [experienceSchema],
      default: []
    },
    skills: {
      type: [skillSchema],
      default: []
    },
    education: {
      type: [educationSchema],
      default: []
    },
    achievements: {
      type: [achievementSchema],
      default: []
    },
    projects: {
      type: [projectSchema],
      default: []
    }
  },

  // Canvas view state (optional - for saving user's view preferences)
  canvasView: {
    zoom: { type: Number, default: 1 },
    panOffset: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 }
    },
    showGrid: { type: Boolean, default: false }
  },

  // Metadata
  isPublic: {
    type: Boolean,
    default: false
  },

  tags: [{
    type: String,
    trim: true
  }],

  lastModified: {
    type: Date,
    default: Date.now
  }

}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
resumeSchema.index({ userId: 1, createdAt: -1 });
resumeSchema.index({ userId: 1, title: 1 });
resumeSchema.index({ tags: 1 });

// Virtual for getting total blocks count
resumeSchema.virtual('totalBlocks').get(function() {
  return this.blocks.length;
});

// Virtual for getting total pages count
resumeSchema.virtual('totalPages').get(function() {
  return this.pages.length;
});

// Pre-save middleware to update lastModified
resumeSchema.pre('save', function(next) {
  this.lastModified = new Date();
});

// Method to check if resume belongs to user
resumeSchema.methods.belongsToUser = function(userId) {
  return this.userId === userId;
};

// Static method to find user's resumes
resumeSchema.statics.findByUser = function(userId, options = {}) {
  const { limit = 10, skip = 0, sort = { updatedAt: -1 } } = options;
  return this.find({ userId })
    .sort(sort)
    .limit(limit)
    .skip(skip)
    .select('-__v');
};

// Static method to search resumes
resumeSchema.statics.searchResumes = function(userId, searchTerm) {
  return this.find({
    userId,
    $or: [
      { title: { $regex: searchTerm, $options: 'i' } },
      { 'resumeData.fullName': { $regex: searchTerm, $options: 'i' } },
      { tags: { $in: [new RegExp(searchTerm, 'i')] } }
    ]
  }).select('-__v');
};

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;