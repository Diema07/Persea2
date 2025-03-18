import '../styles/header.css';
import salir1 from '../img/salir-1.png'; // Importa la imagen

export const Header = () => {
  return (
    <header className="header">
      <nav>
        <ul className="nav-list">
          <div className="left-group">
            <li><a href='/inicio-plantacion'>Plantaciones</a></li>
            <li><a href="/informeGeneral">Informe</a></li>
          </div>
          <li className="cerrar-sesion"> 
            <a href="http://localhost:8000/accounts/logout/">
              
              Cerrar sesión
              <img src={salir1} alt="Cerrar sesión" className="logout-icon" /> {/* Agrega la imagen */}
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;