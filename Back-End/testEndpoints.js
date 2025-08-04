// Test script to verify API endpoints
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

// Test function to check if endpoints are working
async function testEndpoints() {
  try {
    console.log('Testing API endpoints...');
    
    // Test 1: Check if server is running
    try {
      const response = await axios.get(`${API_BASE.replace('/api', '')}`);
      console.log('✅ Server is running:', response.data);
    } catch (error) {
      console.log('❌ Server is not running:', error.message);
      return;
    }
    
    // Test 2: Test patient endpoint (without auth)
    try {
      const response = await axios.get(`${API_BASE}/patients/test-id`);
      console.log('✅ Patient endpoint accessible:', response.status);
    } catch (error) {
      console.log('❌ Patient endpoint error:', error.response?.status, error.response?.data?.message);
    }
    
    // Test 3: Test history endpoint (without auth)
    try {
      const response = await axios.get(`${API_BASE}/history/test-id`);
      console.log('✅ History endpoint accessible:', response.status);
    } catch (error) {
      console.log('❌ History endpoint error:', error.response?.status, error.response?.data?.message);
    }
    
    // Test 4: Test patient tests endpoint (without auth)
    try {
      const response = await axios.get(`${API_BASE}/patients/test-id/show-tests`);
      console.log('✅ Patient tests endpoint accessible:', response.status);
    } catch (error) {
      console.log('❌ Patient tests endpoint error:', error.response?.status, error.response?.data?.message);
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testEndpoints(); 