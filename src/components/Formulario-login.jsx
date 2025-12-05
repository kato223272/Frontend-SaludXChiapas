import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FormularioLogin = () => {
  const [usuarioInput, setUsuarioInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  
  // Apunta a: https://isai.wildroid.space/api/auth
  const AUTH_URL = import.meta.env.VITE_API_URL_AUTH_ADMIN;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Aseguramos que la URL no tenga barra al final y le pegamos /login
      const baseUrl = AUTH_URL?.endsWith('/') ? AUTH_URL.slice(0, -1) : AUTH_URL;
      
      const response = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // SOLICITUD: Solo enviamos username y password
        body: JSON.stringify({ 
            username: usuarioInput, 
            password: password 
        }) 
      });

      const data = await response.json();

      if (response.ok) {
        // Guardamos el token
        localStorage.setItem("token", data.token);
        
        // Guardamos usuario si existe, si no, creamos un objeto básico para que no rompa el app
        const userData = data.user || { username: usuarioInput };
        localStorage.setItem("user", JSON.stringify(userData));
        
        navigate("/graficas");
      } else {
        setError(data.message || "Credenciales incorrectas");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="card px-4 py-5 shadow-sm" style={{ width: "22rem" }}>
        <h6 className="text-center mb-4 color-letra-form">
          Ingresa tus datos correctamente para iniciar sesión como administrador
        </h6>
        
        {error && <div className="alert alert-danger text-center p-1"><small>{error}</small></div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3 color-letra-form text-start">
            <label htmlFor="usuario" className="form-label fw-semibold d-block">
              Usuario
            </label>

            <input
              type="text" 
              className="form-control"
              id="usuario"
              value={usuarioInput}
              onChange={(e) => setUsuarioInput(e.target.value)}
              required
              placeholder=" "
            />
          </div>

          <div className="mb-3 color-letra-form text-start">
            <label htmlFor="password" className="form-label fw-semibold d-block">Contraseña</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="boton-login w-100 mt-5" disabled={loading}>
            {loading ? "Cargando..." : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormularioLogin;