import express from 'express';
import {
  getResumes,
  getResume,
  createResume,
  updateResume,
  deleteResume,
  duplicateResume,
  getResumeStats,
  autoSaveResume
} from './controller.js';

const router = express.Router();

// Statistics route (must be before /:id routes)
router.get('/stats', getResumeStats);

// Main CRUD routes
router.route('/')
  .get(getResumes)
  .post(createResume);

router.route('/:id')
  .get(getResume)
  .put(updateResume)
  .delete(deleteResume);

// Special routes
router.post('/:id/duplicate', duplicateResume);
router.patch('/:id/autosave', autoSaveResume);

export default router;