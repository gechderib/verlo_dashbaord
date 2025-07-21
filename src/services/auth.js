// auth.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8000';

export async function login({ username, password }) {
  try {
    const response = await axios.post(`${BASE_URL}/api/users/login/`, {
      username,
      password,
    });
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response) {
      return { success: false, data: error.response.data };
    }
    return { success: false, data: { status: 'FAILED', error: ['Network error'] } };
  }
}

export async function refreshToken(refresh) {
  try {
    const response = await axios.post(`${BASE_URL}/api/users/token/refresh/`, {
      refresh,
    });
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response) {
      return { success: false, data: error.response.data };
    }
    return { success: false, data: { status: 'FAILED', error: ['Network error'] } };
  }
}

// Utility to check if a JWT is expired
export function isTokenExpired(token) {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // exp is in seconds, Date.now() in ms
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

// Utility to get a valid access token, refreshing if needed
export async function getValidAccessToken() {
  let access = localStorage.getItem('access');
  let refresh = localStorage.getItem('refresh');
  if (!access || !refresh) return null;
  if (!isTokenExpired(access)) {
    return access;
  }
  // Access token expired, try to refresh
  const result = await refreshToken(refresh);
  if (result.success && result.data.status === 'SUCCESS' && result.data.data.access) {
    localStorage.setItem('access', result.data.data.access);
    return result.data.data.access;
  }
  // Refresh failed or refresh token expired
  return null;
} 