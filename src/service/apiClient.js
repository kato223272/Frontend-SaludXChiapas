    import { logoutUser, getToken } from './authService';

// Apunta a Python: https://isai.wildroid.space/api/v1
const DATA_URL = import.meta.env.VITE_API_DATA_URL; 

export const authFetch = async (endpoint, options = {}) => {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`; // <--- AQUÍ ESTÁ LA MAGIA
  }

  const config = {
    ...options,
    headers,
  };

  try {
    // Construye la URL completa: DATA_URL + endpoint
    const response = await fetch(`${DATA_URL}${endpoint}`, config);

    // Si el token caducó (401), cerrar sesión
    if (response.status === 401) {
      logoutUser();
      throw new Error("Sesión expirada");
    }

    return response;
  } catch (error) {
    throw error;
  }
};