import axios from "axios";

/**
 * ✅ Make base URL robust:
 * - If VITE_API_URL is set to ".../api" -> use it
 * - If VITE_API_URL is set to just the domain -> append "/api"
 * - If nothing set -> default to localhost backend "/api"
 */
const RAW =
  import.meta.env.VITE_API_URL?.trim() || "http://localhost:5000";

const BASE = RAW.replace(/\/$/, ""); // remove trailing slash

const API_URL = BASE.endsWith("/api") ? BASE : `${BASE}/api`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 20000, // a bit safer for Render cold start
  withCredentials: true, // ✅ important if you ever use cookies
});

// Request interceptor (for future authentication)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (for error handling)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("API Error:", error.response.data);

      if (error.response.status === 401) {
        localStorage.removeItem("authToken");
      }
    } else if (error.request) {
      console.error("Network Error:", error.request);
    } else {
      console.error("Error:", error.message);
    }

    return Promise.reject(error);
  }
);

// ============================================
// RESUME API ENDPOINTS
// ============================================

export const resumeAPI = {
  getAll: async (params = {}) => {
    const response = await api.get("/resumes", { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/resumes/${id}`);
    return response.data;
  },

  create: async (resumeData) => {
    const response = await api.post("/resumes", resumeData);
    return response.data;
  },

  update: async (id, resumeData) => {
    const response = await api.put(`/resumes/${id}`, resumeData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/resumes/${id}`);
    return response.data;
  },

  duplicate: async (id) => {
    const response = await api.post(`/resumes/${id}/duplicate`);
    return response.data;
  },

  autoSave: async (id, data) => {
    const response = await api.patch(`/resumes/${id}/autosave`, data);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get("/resumes/stats");
    return response.data;
  },
};

// ============================================
// HEALTH CHECK
// ============================================

export const healthCheck = async () => {
  try {
    const response = await api.get("/health");
    return response.data;
  } catch (error) {
    console.error("Health check failed:", error);
    return { success: false, message: "Server is down" };
  }
};

export default api;
