import React from "react";

const FormularioLogin = () => {
  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="card px-4 py-5 shadow-sm" style={{ width: "22rem" }}>
        <h6 className="text-center mb-4 color-letra-form">Ingresa tus datos correctamente para iniciar sesión como administrador</h6>
        <form>
          <div className="mb-3 color-letra-form text-start">
            <label htmlFor="email" className="form-label fw-semibold d-block">
              usuario
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
            />
          </div>

          <div className="mb-3 color-letra-form text-start">
            <label htmlFor="password" className="form-label fw-semibold d-block">
              Contraseña
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
            />
          </div>

          <button type="submit" className="boton-login w-100 mt-5">
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormularioLogin;
