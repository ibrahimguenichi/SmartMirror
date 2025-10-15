import axiosInstance from "./axiosInstance";

/**
 * Send a chat message to the local LLM
 * @param {string} prompt - The user's message/prompt
 * @returns {Promise<Object>} - Response containing the LLM's reply
 */
export const chat = async (prompt) => {
  return axiosInstance.post("/chat", { prompt });
};