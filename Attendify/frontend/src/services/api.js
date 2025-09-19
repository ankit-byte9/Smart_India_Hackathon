import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// We'll store the token in memory and update it through the context
let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
};

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

// API functions
export const authAPI = {
  adminLogin: async (username, password) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    const response = await api.post('/admin/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  teacherLogin: async (username, password) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    const response = await api.post('/teacher/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },
};

export const adminAPI = {
  registerTeacher: async (teacherData) => {
    const response = await api.post('/admin/register_teacher', teacherData);
    return response.data;
  },

  registerStudent: async (name, file) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', file);
    
    const response = await api.post('/admin/register_student', formData);
    return response.data;
  },

  trainModel: async () => {
    const response = await api.post('/train');
    return response.data;
  },
};

export const teacherAPI = {
  uploadAttendance: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/upload', formData);
    return response.data;
  },
};

export default api;