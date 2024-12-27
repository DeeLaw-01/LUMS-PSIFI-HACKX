import axios from 'axios';
import { getAuthHeader } from '../utils/auth';

const API_URL = import.meta.env.VITE_API_URL;

export const getUserStartups = async () => {
  const response = await axios.get(
    `${API_URL}/startups/user`,
    { headers: getAuthHeader() }
  );
  return response.data;
};

export const followStartup = async (startupId: string) => {
  const response = await axios.post(
    `${API_URL}/startups/${startupId}/follow`,
    {},
    { headers: getAuthHeader() }
  );
  return response.data;
};

export const unfollowStartup = async (startupId: string) => {
  const response = await axios.post(
    `${API_URL}/startups/${startupId}/unfollow`,
    {},
    { headers: getAuthHeader() }
  );
  return response.data;
};

export const leaveStartup = async (startupId: string) => {
  const response = await axios.post(
    `${API_URL}/startups/${startupId}/leave`,
    {},
    { headers: getAuthHeader() }
  );
  return response.data;
}; 