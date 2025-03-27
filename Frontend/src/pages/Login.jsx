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
    <div className="login-container">
      
      <div className="login-content">
        <div className="login-card">
          <div className="login-header">
            <img src={avatar} alt="Avatar" className="login-avatar" />
            <h2 className="login-title">Bienvenido a <span>Persea</span></h2>
            <p className="login-subtitle">Gestión Persé </p>
          </div>
          
          <div className="login-body">
            <p className="login-description">
            Optimiza la gestión de tu cultivo de aguacates de manera sencilla y eficiente. 
            Lleva el control de tus cosechas y opten los mejores resultados.
            </p>
            
            <button onClick={handleGoogleLogin} className="login-button">
              <img src={logo} alt="Logo" className="button-icon"/>
              <span>Iniciar sesión con Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
