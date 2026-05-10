import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const msg = error.response?.data?.message;
      if (msg?.includes('expired') || msg?.includes('invalid')) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  sendCustomerOtp: (data) => api.post('/auth/customer/send-otp', data),
  customerSignup: (data) => api.post('/auth/customer/signup', data),
  customerLogin: (data) => api.post('/auth/customer/login', data),
  vendorSignup: (data) => api.post('/auth/vendor/signup', data),
  vendorLogin: (data) => api.post('/auth/vendor/login', data),
  getMe: () => api.get('/auth/me')
};

// Services API
export const servicesAPI = {
  getAll: (params) => api.get('/services', { params }),
  getById: (id) => api.get(`/services/${id}`),
  getCategories: () => api.get('/services/categories'),
  getVendorServices: () => api.get('/services/vendor/my-services'),
  create: (data) => api.post('/services', data)
};

// Bookings API
export const bookingsAPI = {
  create: (data) => api.post('/bookings', data),
  getCustomerBookings: (params) => api.get('/bookings/customer', { params }),
  getVendorBookings: (params) => api.get('/bookings/vendor', { params }),
  getVendorStats: () => api.get('/bookings/vendor/stats'),
  getById: (id) => api.get(`/bookings/${id}`),
  updateStatus: (id, data) => api.patch(`/bookings/${id}/status`, data),
  cancel: (id, data) => api.patch(`/bookings/${id}/cancel`, data)
};

// Customer API
export const customerAPI = {
  getProfile: () => api.get('/customers/profile'),
  updateProfile: (data) => api.put('/customers/profile', data),
  getDashboard: () => api.get('/customers/dashboard')
};

// Vendor API
export const vendorAPI = {
  getProfile: () => api.get('/vendors/profile'),
  updateProfile: (data) => api.put('/vendors/profile', data),
  toggleAvailability: () => api.patch('/vendors/availability'),
  getAll: (params) => api.get('/vendors', { params })
};

export default api;
