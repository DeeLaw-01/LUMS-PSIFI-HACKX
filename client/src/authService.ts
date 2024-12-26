import axios from 'axios'

const API_URL = 'http://localhost:4000/auth'

export const authService = {
  login: async (email: string, password: string) => {
    const response = await axios.post(
      `${API_URL}/login`,
      { email, password },
      { withCredentials: true }
    )
    return response.data
  },

  register: async (name: string, email: string, password: string) => {
    const response = await axios.post(
      `${API_URL}/register`,
      { name, email, password },
      { withCredentials: true }
    )
    return response.data
  },

  googleLogin: async (credential: string) => {
    const response = await axios.post(
      `${API_URL}/google`,
      { credential },
      { withCredentials: true }
    )
    return response.data
  },

  logout: async () => {
    await axios.post(`${API_URL}/logout`, {}, { withCredentials: true })
  }
}
