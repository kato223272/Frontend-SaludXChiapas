import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FormularioLogin = () => {
  const [usuarioInput, setUsuarioInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  
  // Usamos la variable de entorno que apunta a tu IP (http://100.30.34.18/)
  const AUTH_URL = import.meta.env.VITE_API_URL_AUTH_ADMIN;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Corrección: Definir baseUrl asegurando que no tenga doble slash al final
      const baseUrl = AUTH_URL?.endsWith('/') ? AUTH_URL.slice(0, -1) : AUTH_URL;

      // 2. Corrección: Enviar los datos mapeando 'usuarioInput' a lo que espera el backend
      const response = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            // Enviamos el input en ambos campos para asegurar que el backend lo encuentre
            username: usuarioInput, 
            identifier: usuarioInput,
            password: password 
        }) 
      });

      const data = await response.json();

      if (response.ok) {
        // 3. Login Exitoso
        localStorage.setItem("token", data.token);
        // Guardamos datos del usuario si vienen en la respuesta
        if(data.user) localStorage.setItem("user", JSON.stringify(data.user));
        
        navigate("/graficas");
      } else {
        // 4. Error de credenciales
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