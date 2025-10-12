import axiosInstance from "./axiosInstance";

export const login = async (email, password) => {
  return axiosInstance.post("/auth/login", { email, password });
};

export const register = async (userData) => {
  return axiosInstance.post("/auth/register", userData);
};

export const getCurrentUser = async () => {
  return axiosInstance.get("/auth/me");
};

export const logout = async () => {
  return axiosInstance.post("/auth/logout");
};
