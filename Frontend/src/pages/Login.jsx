import '../styles/login.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import aguacate from "../img/aguacate.png";
import persea from "../img/persea1.png";
import logo from "../img/logo.png";
import avatar from '../img/avatar.jpg'

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
    window.location.href = 'http://localhost:8000/api/usuarios/login-google/';
  };

  return (
    <div className="glass-container">
      <img src={avatar} alt="Avatar" className="glass-avatar" />
      <div className="glass-box">
        <h2 className='sub'>Bienvenido a  <span className="persea-text">Persea</span>!</h2>
        <p className="glass-text">
        Optimiza la producción y gestión de tu cultivo de aguacates de manera sencilla y eficiente. Lleva el control de tus cosechas  y análisis en un solo lugar.
        </p>
        <button onClick={handleGoogleLogin} className="glass-button">
          <img src={logo} alt="Google Logo" className='glass-logo'/>
          Iniciar sesión
        </button>
      </div>
    </div>
  );
}

export default Login;
