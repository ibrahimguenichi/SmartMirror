import axiosInstance from "./axiosInstance";

// Create a new client
export const createClient = async (clientData) => {
  const response = await axiosInstance.post("/users/client", clientData);
  return response.data;
};

// Create a new employee
export const createEmployee = async (employeeData) => {
  const response = await axiosInstance.post("/users/employee", employeeData);
  return response.data;
};

// Upload profile image for a user
export const uploadProfileImage = async (userId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosInstance.post(`/users/${userId}/profile-image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Get all users (admin only)
export const getAllUsers = async () => {
  const response = await axiosInstance.get("/users");
  return response.data;
};
