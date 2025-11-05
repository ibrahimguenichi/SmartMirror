import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Attach JWT automatically to all requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Optional response interceptor for logging
axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    console.error("API Error:", error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default axiosInstance;
