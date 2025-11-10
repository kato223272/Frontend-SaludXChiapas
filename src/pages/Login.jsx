import FormularioLogin from "../components/Formulario-login";
import "./../styles/Login.css";
import { Row } from "react-bootstrap";
import Logo from "../../public/favicon.ico";

function Home() {
  return (
    <div className="container-fluid">
      <Row>
        <div className="divpadre col-12 col-md vh-100 text-center justify-content-center align-item-center">
          <div className="d-flex justify-content-start color-principal-letra p-3">
            {/* <h5 className="m-0 fw-bold">SaludxChiapas</h5> */}
          </div>
          <h4 className="color-principal-letra mt-5">¡Bienvenido!</h4>
          <div>
            <FormularioLogin />
          </div>
          
        </div>
        <div className="col-12 col-md vh-100 fondo-login-derecha text-white text-center justify-content-center align-item-center d-flex flex-column">
          <img 
         src={Logo} 
         alt="Logo" 
         className="img-fluid" 
         style={{marginLeft:"25%", maxWidth: '50%', height: 'auto' }} 
        />
        </div>
      </Row>
    </div>
  );
}

export default Home;
