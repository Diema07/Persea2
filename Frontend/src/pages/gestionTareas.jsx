import '../styles/gestionTareas.css';
import { Link, useParams, useNavigate } from "react-router-dom";
import React from 'react';

export function GestionTareasPage() {
  const { plantacionId } = useParams();
  const navigate = useNavigate(); // Hook para redireccionar
  


  const handleRedirectToPlantacion = () => {
    navigate(`/inicio-plantacion/`); // Cambia la ruta según tu configuración
  };

  return (  


    <div className="contenedor3">
      <h2>Gestión de Tareas - Plantación {plantacionId}</h2>

      <ul>
        <li>
          <Link to={`/preparacion/${plantacionId}/`}>Gestion de preparacion terreno</Link>
          <div className="estado"></div>
        </li>

        <li>
        <Link to={`/seleccion-arboles/${plantacionId}/`}>Gestion de seleccion de arboles </Link>
        <div className="estado"></div>
        </li>

        <li>
        <Link to={`/riego-fertilizacion/${plantacionId}/`}>Gestión de Riego</Link>
          <div className="estado"></div>
        </li>

        <li>
        <Link to={`/mantenimiento-monitoreo/${plantacionId}/`}>Gestion Mantenimiento</Link>
          <div className="estado"></div>
        </li>

        <li>
        <Link to={`/poda/${plantacionId}/`}>Gestión de Poda</Link>

          <div className="estado"></div>
        </li>

        <li>
        <Link to={`/cosecha/${plantacionId}/`}>Cosecha</Link>
          <div className="estado"></div>
        </li>

        <li>
        <Link to={`/informe-completo/${plantacionId}/`}>Informe</Link>
        </li>
        
      </ul>
      

      

      <button
        onClick={handleRedirectToPlantacion}
        style={{
          marginBottom: '16px',
          padding: '8px 16px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Ir a Plantacion 
      </button>
    </div>
  );
}

export default GestionTareasPage;
