import axios from "axios";

// FastAPI backend (LLM) instance
const axiosAiInstance = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});

export default axiosAiInstance;
