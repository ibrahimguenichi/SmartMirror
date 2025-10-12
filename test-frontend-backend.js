// Test script to verify frontend-backend communication
const axios = require('axios');

const BACKEND_URL = 'http://localhost:8080/api';
const FRONTEND_URL = 'http://localhost:5174';

async function testConnection() {
  try {
    console.log('Testing backend connectivity...');
    
    // Test 1: Backend health check
    try {
      const response = await axios.get(`${BACKEND_URL}/auth/csrf`);
      console.log('✅ Backend is running:', response.status);
    } catch (error) {
      console.log('❌ Backend connectivity issue:', error.message);
      return;
    }
    
    // Test 2: Test login endpoint with invalid credentials
    try {
      const response = await axios.post(`${BACKEND_URL}/auth/login`, {
        email: 'test@example.com',
        password: 'wrongpassword'
      });
      console.log('❌ Unexpected success with invalid credentials');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Login endpoint working correctly (401 for invalid credentials)');
      } else {
        console.log('❌ Login endpoint error:', error.response?.status, error.response?.data);
      }
    }
    
    // Test 3: Test CORS preflight
    try {
      const response = await axios.options(`${BACKEND_URL}/auth/login`);
      console.log('✅ CORS preflight working:', response.status);
    } catch (error) {
      console.log('❌ CORS issue:', error.message);
    }
    
    console.log('\nBackend tests completed. Frontend should be accessible at:', FRONTEND_URL);
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testConnection();


