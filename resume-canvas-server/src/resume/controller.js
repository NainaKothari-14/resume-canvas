import Resume from './model.js';

// @desc    Get all resumes for a user
// @route   GET /api/resumes
// @access  Public (will be Private with auth)
export const getResumes = async (req, res) => {
  try {
    const { 
      limit = 10, 
      page = 1, 
      sort = 'updatedAt',
      order = 'desc',
      search = ''
    } = req.query;

    const skip = (page - 1) * limit;
    const sortOrder = order === 'desc' ? -1 : 1;

    let query = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'resumeData.fullName': { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const resumes = await Resume.find(query)
      .sort({ [sort]: sortOrder })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .select('-__v');

    const total = await Resume.countDocuments(query);

    return res.status(200).json({
      success: true,
      count: resumes.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: resumes
    });
  } catch (error) {
    console.error('Error in getResumes:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching resumes',
      error: error.message
    });
  }
};

// @desc    Get single resume by ID
// @route   GET /api/resumes/:id
// @access  Public (will be Private with auth)
export const getResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id).select('-__v');

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: resume
    });
  } catch (error) {
    console.error('Error in getResume:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error fetching resume',
      error: error.message
    });
  }
};

// @desc    Create new resume
// @route   POST /api/resumes
// @access  Public (will be Private with auth)
export const createResume = async (req, res) => {
  try {
    console.log('📥 Creating resume with data:', req.body);

    const resumeData = {
      ...req.body,
      // userId: req.user.id, // Uncomment when auth is added
    };

    const resume = await Resume.create(resumeData);

    console.log('✅ Resume created:', resume._id);

    return res.status(201).json({
      success: true,
      message: 'Resume created successfully',
      data: resume
    });
  } catch (error) {
    console.error('❌ Error in createResume:', error);
    console.error('Stack:', error.stack);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error creating resume',
      error: error.message
    });
  }
};

// @desc    Update resume
// @route   PUT /api/resumes/:id
// @access  Public (will be Private with auth)
export const updateResume = async (req, res) => {
  try {
    let resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    resume = await Resume.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    return res.status(200).json({
      success: true,
      message: 'Resume updated successfully',
      data: resume
    });
  } catch (error) {
    console.error('Error in updateResume:', error);

    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error updating resume',
      error: error.message
    });
  }
};

// @desc    Delete resume
// @route   DELETE /api/resumes/:id
// @access  Public (will be Private with auth)
export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    await resume.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Resume deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('Error in deleteResume:', error);

    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error deleting resume',
      error: error.message
    });
  }
};

// @desc    Duplicate resume
// @route   POST /api/resumes/:id/duplicate
// @access  Public (will be Private with auth)
export const duplicateResume = async (req, res) => {
  try {
    const originalResume = await Resume.findById(req.params.id);

    if (!originalResume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    const resumeCopy = originalResume.toObject();
    delete resumeCopy._id;
    delete resumeCopy.createdAt;
    delete resumeCopy.updatedAt;
    delete resumeCopy.__v;

    resumeCopy.title = `${resumeCopy.title} (Copy)`;

    const newResume = await Resume.create(resumeCopy);

    return res.status(201).json({
      success: true,
      message: 'Resume duplicated successfully',
      data: newResume
    });
  } catch (error) {
    console.error('Error in duplicateResume:', error);

    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error duplicating resume',
      error: error.message
    });
  }
};

// @desc    Get resume statistics
// @route   GET /api/resumes/stats
// @access  Public (will be Private with auth)
export const getResumeStats = async (req, res) => {
  try {
    const stats = await Resume.aggregate([
      {
        $group: {
          _id: null,
          totalResumes: { $sum: 1 },
          totalBlocks: { $sum: { $size: '$blocks' } },
          totalPages: { $sum: { $size: '$pages' } },
          avgBlocksPerResume: { $avg: { $size: '$blocks' } },
          avgPagesPerResume: { $avg: { $size: '$pages' } }
        }
      }
    ]);

    const recentResumes = await Resume.find()
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('title updatedAt');

    return res.status(200).json({
      success: true,
      data: {
        statistics: stats[0] || {
          totalResumes: 0,
          totalBlocks: 0,
          totalPages: 0,
          avgBlocksPerResume: 0,
          avgPagesPerResume: 0
        },
        recentResumes
      }
    });
  } catch (error) {
    console.error('Error in getResumeStats:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};

// @desc    Auto-save resume (patch specific fields)
// @route   PATCH /api/resumes/:id/autosave
// @access  Public (will be Private with auth)
export const autoSaveResume = async (req, res) => {
  try {
    const resume = await Resume.findByIdAndUpdate(
      req.params.id,
      { 
        $set: req.body,
        lastModified: new Date()
      },
      { 
        new: true,
        runValidators: true
      }
    );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Auto-saved successfully',
      data: { lastModified: resume.lastModified }
    });
  } catch (error) {
    console.error('Error in autoSaveResume:', error);
    return res.status(500).json({
      success: false,
      message: 'Error auto-saving resume',
      error: error.message
    });
  }
};