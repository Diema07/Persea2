import React, { useEffect, useState } from 'react';
import '../styles/header.css';
import salir1 from '../img/salir-1.png';
import { getProfileImage } from '../api/plantaciones.api';

export const Header = ({ onLogoutClick }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [username, setUsername] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false); // Estado para abrir/cerrar el menú

  useEffect(() => {
    async function fetchProfileImage() {
      try {
        const data = await getProfileImage();
        setProfileImage(data.profile_picture);
        const formattedUsername = data.username
          .replace('_', ' ')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        setUsername(formattedUsername);
      } catch (error) {
        console.error('Error al obtener la imagen de perfil:', error);
      }
    }
    fetchProfileImage();
  }, []);

  return (
    <header className="header">
    
      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      <nav>
        <ul className={`nav-list ${menuOpen ? 'active' : ''}`}>
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
              {username && (
                <span className="username">{username}</span>
              )}
              <img src={profileImage} alt="Foto de perfil" className="profile-img" />
            </li>
          )}
          <li className="cerrar-sesion">
            <a href="#" onClick={(e) => {
              e.preventDefault();
              onLogoutClick();
            }}>
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
