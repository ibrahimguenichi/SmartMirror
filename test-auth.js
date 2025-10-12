// Simple test script to verify backend authentication
const axios = require('axios');

const BASE_URL = 'http://localhost:8080/api';

async function testAuth() {
  try {
    console.log('Testing authentication flow...');
    
    // Test 1: Try to get current user without authentication
    console.log('\n1. Testing /auth/me without authentication:');
    try {
      const response = await axios.get(`${BASE_URL}/auth/me`);
      console.log('Unexpected success:', response.data);
    } catch (error) {
      console.log('Expected error:', error.response?.status, error.response?.data);
    }
    
    // Test 2: Try to get current user with fake token
    console.log('\n2. Testing /auth/me with fake token:');
    try {
      const response = await axios.get(`${BASE_URL}/auth/me`, {
        headers: {
          'Authorization': 'Bearer fake-token'
        }
      });
      console.log('Unexpected success:', response.data);
    } catch (error) {
      console.log('Expected error:', error.response?.status, error.response?.data);
    }
    
    // Test 3: Check if backend is running
    console.log('\n3. Testing backend connectivity:');
    try {
      const response = await axios.get(`${BASE_URL}/auth/csrf`);
      console.log('Backend is running:', response.status);
    } catch (error) {
      console.log('Backend connectivity issue:', error.message);
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testAuth();




