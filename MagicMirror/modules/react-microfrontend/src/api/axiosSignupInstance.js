import axios from "axios";

// Axios instance dedicated to signup flows (ngrok HTTPS only)
const axiosSignupInstance = axios.create({
  baseURL: "https://minnow-blessed-usually.ngrok-free.app/api",
});

export default axiosSignupInstance;


