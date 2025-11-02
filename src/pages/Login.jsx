import FormularioLogin from "../components/Formulario-login";
import "./../styles/Login.css";

function Home() {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 col-md vh-100 bg-white text-white text-center justify-content-center align-item-center">
          <div className="d-flex justify-content-end color-principal-letra p-3">
            <h3 className="m-0">SaludxChiapas</h3>
          </div>
          <h2 className="color-principal-letra">¡Bienvenido!</h2>
          <FormularioLogin />
        </div>
        <div className="col-12 col-md vh-100 fondo-login-derecha text-white text-center"></div>
      </div>
    </div>
  );
}

export default Home;
