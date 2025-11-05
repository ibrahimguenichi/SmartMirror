import axiosAiInstance from "./axiosAiInstance";

/**
 * Send a chat message to the local LLM
 * @param {string} prompt - The user's message/prompt
 * @returns {Promise<Object>} - Response containing the LLM's reply
 */
export const chat = async (prompt, userId) => {
  const body = userId ? { prompt, userId: String(userId) } : { prompt };
  return axiosAiInstance.post("/llm/chat", body);
};
