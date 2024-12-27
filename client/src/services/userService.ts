import axios from 'axios';
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
  const response = await axios.get(
    `${API_URL}/posts/user/${userId}`,
    { headers: getAuthHeader() }
  );
  return response.data;
}; 