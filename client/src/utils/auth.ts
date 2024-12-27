import { useAuthStore } from '@/store/useAuthStore';

export const getAuthHeader = () => {
  const { token } = useAuthStore.getState();
  return {
    Authorization: `Bearer ${token}`
  };
}; 