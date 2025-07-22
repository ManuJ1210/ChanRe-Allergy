import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
  } catch (err) {
    console.error('❌ Error reading token from localStorage:', err);
  }
  return config;
});

export default API;
