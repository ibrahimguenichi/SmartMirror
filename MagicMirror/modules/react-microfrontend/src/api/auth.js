import axiosInstance from "./axiosInstance";

export async function login(email, password) {
  const response = await axiosInstance.post("/auth/login", { email, password });
  const { token } = response.data;

  localStorage.setItem("token", token);

  return response;
}

export const register = async (userData) => {
  return axiosInstance.post("/auth/register", userData);
};

export const getCurrentUser = async () => {
  return axiosInstance.get("/auth/me");
};

export async function logout() {
  localStorage.removeItem("token");
  return axiosInstance.post("/auth/logout");
}
