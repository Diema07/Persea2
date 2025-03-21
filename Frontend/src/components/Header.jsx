import React, { useEffect, useState } from 'react';
import '../styles/header.css';
import salir1 from '../img/salir-1.png'; // Icono de cerrar sesión
import { getProfileImage } from '../api/plantaciones.api'; // Asegúrate de que la ruta sea la correcta

export const Header = () => {
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    async function fetchProfileImage() {
      try {
        const data = await getProfileImage();
        setProfileImage(data.profile_picture);
      } catch (error) {
        console.error('Error al obtener la imagen de perfil:', error);
      }
    }
    fetchProfileImage();
  }, []);

  return (
    <header className="header">
      <nav>
        <ul className="nav-list">
          <div className="left-group">
            <li>
              <a href="/inicio-plantacion">Plantaciones</a>
            </li>
            <li>
              <a href="/informeGeneral">Informe</a>
            </li>
          </div>
          {profileImage && (
            <li className="profile-image">
              <img src={profileImage} alt="Foto de perfil" className="profile-img" />
            </li>
          )}
          <li className="cerrar-sesion">
            <a href="http://localhost:8000/accounts/logout/">
              Cerrar sesión
              <img src={salir1} alt="Cerrar sesión" className="logout-icon" />
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
