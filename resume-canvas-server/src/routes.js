import express from 'express';
import resumeRoutes from './resume/routes.js';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Resume Canvas API is running!',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// API info endpoint
router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to Resume Canvas API',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            resumes: '/api/resumes',
            stats: '/api/resumes/stats'
        },
        documentation: 'https://github.com/yourusername/resume-canvas-server'
    });
});

// Mount resume routes
router.use('/resumes', resumeRoutes);

// 404 handler for API routes - catch all remaining routes
router.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found',
        requestedUrl: req.originalUrl
    });
});

export default router;