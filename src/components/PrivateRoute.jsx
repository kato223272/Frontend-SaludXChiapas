// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../service/authService'; 

const PrivateRoute = ({ children }) => {
  const token = getToken();
  
  // Si NO hay token, te expulsa al Login ("/")
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Si SÍ hay token, te deja ver el componente hijo
  return children;
};

export default PrivateRoute;