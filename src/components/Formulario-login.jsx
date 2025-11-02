import React from "react";

const FormularioLogin = () => {
  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="card p-4 shadow-sm" style={{ width: "22rem" }}>
        <h6 className="text-center mb-4 color-principal-letra-login">Ingresa tus datos correctamente para iniciar sesión como administrador</h6>
        <form>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              usuario
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
            />
          </div>

          <button type="submit" className="boton-login w-100">
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormularioLogin;
