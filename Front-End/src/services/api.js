import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000, // 10 second timeout
});

// Test function to check API connectivity
export const testAPIConnection = async () => {
  try {
    const response = await API.get('/auth/me');
    return true;
  } catch (error) {
    return false;
  }
};

API.interceptors.request.use((config) => {
  try {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    let token = null;
    
    if (storedUser) {
      const user = JSON.parse(storedUser);
      
      // Check if token is in user object
      if (user?.token) {
        token = user.token;
      }
    }
    
    // If no token in user object, check separate token storage
    if (!token && storedToken) {
      token = storedToken;
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Debug log for API requests
    console.log('[API DEBUG] Request to:', config.baseURL + config.url, 'with token:', token);
  } catch (err) {
    console.error('Error reading token from localStorage:', err);
  }
  
  return config;
});

// Add response interceptor to log errors
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle specific error cases
    if (error.response?.status === 401) {
      console.error('Authentication Error - Token may be expired or invalid');
      // Optionally redirect to login
      // window.location.href = '/login';
    } else if (error.response?.status === 403) {
      console.error('Authorization Error - User does not have permission');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('Connection Error - Backend server may not be running');
    }
    
    return Promise.reject(error);
  }
);

export default API;
