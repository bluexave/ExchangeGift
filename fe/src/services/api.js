import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const draftPickOrder = async (groups) => {
  try {
    const response = await apiClient.post('/api/draft-pick-order', { groups });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to draft pick order' };
  }
};

export const draftMembers = async (groups, sendEmails = false) => {
  try {
    const response = await apiClient.post('/api/match', {
      groups,
      sendEmails,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to draft members' };
  }
};

export const saveGroups = async (groups, filename) => {
  try {
    const response = await apiClient.post('/api/groups/save', { groups, filename });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to save groups' };
  }
};

export const loadGroups = async (filename) => {
  try {
    const response = await apiClient.get(`/api/groups/load/${filename}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to load groups' };
  }
};

export const listGroupFiles = async () => {
  try {
    const response = await apiClient.get('/api/groups/list');
    return response.data.files || [];
  } catch (error) {
    throw error.response?.data || { error: 'Failed to list group files' };
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
