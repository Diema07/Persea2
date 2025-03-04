import '../styles/login.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import aguacate from "../img/aguacate.png";
import persea from "../img/persea1.png";
import logo from "../img/logo.png";

export function Login() {
  const navigate = useNavigate();

  const fetchCsrfToken = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/usuarios/get-csrf-token/', {
        withCredentials: true,
      });
      console.log('Token CSRF obtenido:', response.data.csrfToken);
    } catch (error) {
      console.error('Error al obtener el token CSRF:', error);
    }
  };

  useEffect(() => {
    fetchCsrfToken();
  }, []);

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8000/accounts/google/login/';
  };

  return (
    <div className="contenedor">
      <div className="caja">
        <div className="contenedor-2">
          <div className="parte-izquierda">
            <img src={persea} alt="Planta" className="imagen" />
            <p className="slogan">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit iste facilis ipsum nesciunt quibusdam, error, modi numquam et adipisci dolorem nulla at repellendus provident placeat amet eaque rem quasi. Nulla.
            </p>
            <button onClick={handleGoogleLogin} className="google-login-button">
              <img src={logo} alt="Google Logo" className='logo'/>
              Iniciar sesión con Google
            </button>
          </div>
          <div className="parte-derecha">
            <img src={aguacate} alt="Aguacate" className="imagen-lateral" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
