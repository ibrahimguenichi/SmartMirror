import axiosInstance from "./axiosInstance";

// Get all reservations
export const getAllReservations = async () => {
  const response = await axiosInstance.get("/reservation");
  return response.data;
};

// Add a new reservation
export const addReservation = async (reservationData) => {
  const response = await axiosInstance.post("/reservation", reservationData);
  return response.data;
};

// Get reservations for the current user
export const getMyReservations = async () => {
  const response = await axiosInstance.get("/reservation/my");
  return response.data;
};

// Get available times for a specific date (date format: 'YYYY-MM-DD')
export const getAvailableTimes = async (date) => {
  const response = await axiosInstance.get("/reservation/available-times", {
    params: { date },
  });
  return response.data;
};

// Delete a reservation by ID
export const deleteReservation = async (id) => {
  const response = await axiosInstance.delete(`/reservation/${id}`);
  return response.data;
};