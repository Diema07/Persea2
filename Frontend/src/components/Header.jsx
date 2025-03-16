import '../styles/header.css'
import salir from '../img/img8.png'

const Header = () => {
    return (
      <header>
        
        <nav>
          <ul>
            <li><a href="/informeGeneral">Informe</a></li>
            <li><a href='/inicio-plantacion'>Plantaciones</a></li>
            <li>
            <a href="http://localhost:8000/accounts/logout/">
              <img src={salir} alt="salir" className='atrasLogin'/>
            </a>
          </li>
          </ul>
        </nav>
      </header>
    );
  };
  
  export default Header;