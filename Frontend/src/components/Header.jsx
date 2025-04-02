import React, { useEffect, useState } from 'react';
import '../styles/header.css';
import salir1 from '../img/salir-1.png';
import { getProfileImage } from '../api/plantaciones.api';

export const Header = ({ onLogoutClick }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [username, setUsername] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchProfileImage() {
      try {
        const data = await getProfileImage();
        if (data?.profile_picture) {
          // Formatear el username
          const formattedUsername = data.username
            .replace('_', ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          setUsername(formattedUsername);

          // Pre-cargar la imagen antes de actualizar el estado
          const img = new Image();
          img.src = data.profile_picture;
          img.onload = () => {
            setProfileImage(data.profile_picture);
          };
          img.onerror = () => {
            console.error('Error al cargar la imagen pre-cargada.');
          };
        }
      } catch (error) {
        console.error('Error al obtener la imagen de perfil:', error);
      }
    }
    fetchProfileImage();
  }, []);

  return (
    <header className="header">
      {/* Hamburguesa + Menú navegación */}
      <div className="nav-section">
        <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>
        
        <nav>
          <ul className={`nav-list ${menuOpen ? 'active' : ''}`}>
            <li><a href="/inicio-plantacion">Plantaciones</a></li>
            <li><a href="/informeGeneral">Informe</a></li>
          </ul>
        </nav>
      </div>

      {/* Perfil + Cerrar sesión (siempre visibles) */}
      <div className="profile-section">
        {profileImage && (
          <div className="profile-container">
            <span className="username">{username}</span>
            <img src={profileImage} alt="Perfil" className="profile-img" />
          </div>
        )}
        
        <div className="logout-container">
          <a href="#" onClick={(e) => {
            e.preventDefault();
            onLogoutClick();
          }}>
            <span className="logout-text">Cerrar sesión</span>
            <img src={salir1} alt="Cerrar sesión" className="logout-icon" />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
