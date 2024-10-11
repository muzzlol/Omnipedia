import axios from 'axios';

const API_URL = 'http://localhost:5001'; // konect backend

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
  } catch (error: any) {
    console.error('Login error:', error.response?.data || error.message);
    if (error.response?.status === 400) {
      throw new Error(error.response.data.message);
    }
    throw new Error('An error occurred during login');
  }
};

export const register = async (username: string, email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, { username, email, password });
    return response.data;
  } catch (error: any) {
    console.error('Registration error:', error.response?.data || error.message);
    if (error.response?.status === 400) {
      throw new Error(error.response.data.message);
    }
    throw new Error('An error occurred during registration');
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};