import '../styles/login.css';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import { useEffect } from 'react';
import logo from "../img/logo.png";
import avatar from '../img/avatar.jpg'

export function Login() {

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
        Optimiza la gestión de tu cultivo de aguacates de manera sencilla y eficiente. Lleva el control de tus cosechas y opten los mejores resultados.
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
