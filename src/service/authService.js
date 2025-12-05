const AUTH_URL = import.meta.env.VITE_API_URL_AUTH_ADMIN; 

export const loginUser = async (identifier, password) => {
  try {
    const baseUrl = AUTH_URL.endsWith('/') ? AUTH_URL.slice(0, -1) : AUTH_URL;
    
    const response = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // CORREGIDO: Solo username y password
      body: JSON.stringify({ 
          username: identifier, 
          password 
      }) 
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al iniciar sesión');
    }

    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user || { username: identifier }));
    }

    return data;
  } catch (error) {
    console.error("Error en login:", error);
    throw error;
  }
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
};

export const getToken = () => localStorage.getItem('token');