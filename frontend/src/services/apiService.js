// src/services/apiService.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api', // Your backend API URL
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('API Request:', config.method?.toUpperCase(), config.baseURL + config.url);
  return config;
});

// Handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  // Auth endpoints
  testBackend: () => {
    return axios.get('http://localhost:3001/');
  },
  login: (credentials) => {
    return apiClient.post('/auth/login', credentials);
  },
  register: (userData) => {
    return apiClient.post('/auth/register', userData);
  },
  verifyToken: () => {
    return apiClient.get('/auth/verify');
  },

  // Patient endpoints
  getAssignedDoctor: () => {
    return apiClient.get('/patient/my-doctor');
  },
  uploadRecord: (recordData) => {
    return apiClient.post('/patient/upload', recordData);
  },
  testPatientRoutes: () => {
    console.log('API: Testing patient routes...');
    return apiClient.get('/patient/test');
  },
  getPatientRecords: () => {
    console.log('API: Getting patient records...');
    console.log('API: Calling URL: /api/patient/records');
    return apiClient.get('/patient/records');
  },
  getRecord: (recordId) => {
    return apiClient.get(`/patient/records/${recordId}`);
  },

  // Doctor endpoints
  getAssignedPatients: () => {
    return apiClient.get('/doctor/assigned-patients');
  },
  getAllPatients: () => {
    return apiClient.get('/doctor/all-patients');
  },
  getPatientRecordsForDoctor: (patientId) => {
    return apiClient.get(`/doctor/patients/${patientId}/records`);
  },
  getRecord: (recordId) => {
    return apiClient.get(`/doctor/record/${recordId}`);
  },
  searchPatients: (query) => {
    return apiClient.get(`/doctor/search-patients?query=${query}`);
  },

  // Admin endpoints
  getPendingUsers: (role) => {
    return apiClient.get(`/admin/pending-users${role ? `?role=${role}` : ''}`);
  },
  verifyUser: (userId, isApproved) => {
    return apiClient.put(`/admin/users/${userId}/verify`, { isApproved });
  },
  assignDoctor: (assignmentData) => {
    return apiClient.post('/admin/assign-doctor', assignmentData);
  },
  unassignDoctor: (assignmentData) => {
    return apiClient.post('/admin/unassign-doctor', assignmentData);
  },
  getAssignmentData: () => {
    return apiClient.get('/admin/assignment-data');
  },
  getAllRecords: () => {
    return apiClient.get('/admin/all-records');
  },
  getUsersByRole: (role) => {
    console.log(`API: Getting users by role: ${role}`);
    return apiClient.get(`/admin/users/${role}`);
  }
};