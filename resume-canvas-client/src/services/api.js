import axios from 'axios';

// Base API URL - change this based on environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor (for future authentication)
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (for error handling)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error cases
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
      
      if (error.response.status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('authToken');
        // window.location.href = '/login'; // Uncomment when you have auth
      }
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// ============================================
// RESUME API ENDPOINTS
// ============================================

export const resumeAPI = {
  // Get all resumes with optional filters
  getAll: async (params = {}) => {
    const response = await api.get('/resumes', { params });
    return response.data;
  },

  // Get single resume by ID
  getById: async (id) => {
    const response = await api.get(`/resumes/${id}`);
    return response.data;
  },

  // Create new resume
  create: async (resumeData) => {
    const response = await api.post('/resumes', resumeData);
    return response.data;
  },

  // Update resume
  update: async (id, resumeData) => {
    const response = await api.put(`/resumes/${id}`, resumeData);
    return response.data;
  },

  // Delete resume
  delete: async (id) => {
    const response = await api.delete(`/resumes/${id}`);
    return response.data;
  },

  // Duplicate resume
  duplicate: async (id) => {
    const response = await api.post(`/resumes/${id}/duplicate`);
    return response.data;
  },

  // Auto-save resume (partial update)
  autoSave: async (id, data) => {
    const response = await api.patch(`/resumes/${id}/autosave`, data);
    return response.data;
  },

  // Get statistics
  getStats: async () => {
    const response = await api.get('/resumes/stats');
    return response.data;
  },
};

// ============================================
// HEALTH CHECK
// ============================================

export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    return { success: false, message: 'Server is down' };
  }
};

// Export the axios instance for custom requests
export default api;