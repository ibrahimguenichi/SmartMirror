import axios from "axios";
import { AppConstants } from "../util/constants";

const axiosInstance = axios.create({
  baseURL: AppConstants.BACKEND_URL,
  withCredentials: true,
});

// Note: JWT token is automatically sent via HttpOnly cookie
// No need to manually add it to Authorization header

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.status, error.response?.data);
    
    // Handle unauthorized errors
    if (error.response?.status === 401) {
      console.log('Unauthorized - API call failed, letting component handle the redirect');
      // Clear the JWT cookie but don't redirect
      document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;