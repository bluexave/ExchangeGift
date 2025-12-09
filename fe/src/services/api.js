import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const matchFamilies = async (families, sendEmails = false) => {
  try {
    const response = await apiClient.post('/api/match', {
      families,
      sendEmails,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to match families' };
  }
};

export const checkHealth = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('API server is not responding');
  }
};

export default apiClient;
