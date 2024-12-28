import axios from 'axios';
import api from '@/lib/axios';
import { getAuthHeader } from '../utils/auth';

const API_URL = import.meta.env.VITE_API_URL;

export const updateUserProfile = async (userData: any) => {
  const response = await axios.put(
    `${API_URL}/users/update`,
    userData,
    { headers: getAuthHeader() }
  );
  return response.data;
};

export const getUserPosts = async (userId: string) => {
  const response = await api.get(`/api/users/${userId}/posts`);
  return response.data;
};

export const getRecentUsers = async (limit: number = 5) => {
  const response = await api.get(`/api/users/recent?limit=${limit}`);
  return response.data;
};

export const getUserProfile = async (userId: string) => {
  const response = await api.get(`/api/users/${userId}/profile`);
  return response.data;
};

const userService = {
  getRecentUsers,
  getUserProfile,
  getUserPosts,
  updateUserProfile
};

export default userService; 