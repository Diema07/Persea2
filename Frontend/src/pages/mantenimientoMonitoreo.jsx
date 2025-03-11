import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMantenimientoByPlantacionId } from '../api/mantenimientoMonitoreo.api';
import { MantenimientoMonitoreoForm } from '../components/mantenimientoMonitoreoForm';
import atras from "../img/atras.png";
import '../styles/historial.css';
import '../styles/formulario.css'

export function MantenimientoMonitoreoPage() {
  const { plantacionId } = useParams();
  const idPlantacion = Number(plantacionId);
  const [mantenimientos, setMantenimientos] = useState([]);
  const navigate = useNavigate();

  // Carga los mantenimientos existentes
  const loadMantenimientos = async () => {
    if (!idPlantacion) {
      console.error("plantacionId es undefined o no es un número");
      return;
    }
    try {
      const data = await getMantenimientoByPlantacionId(idPlantacion);
      setMantenimientos(data || []);
    } catch (error) {
      console.error('Error al obtener mantenimientos:', error);
    }
  };

  useEffect(() => {
    if (idPlantacion) {
      loadMantenimientos();
    }
  }, [idPlantacion]);

  // Obtener el ID del primer mantenimiento (si existe)
  const mantenimientoId = mantenimientos.length > 0 ? mantenimientos[0].id : null;

  // Botón para ir a Gestión de Tareas
  const handleRedirectToGestionTareas = () => {
    navigate(`/gestionTareas/${idPlantacion}`);
  };

  return (
    <div className="riego-fertilizacion-container">
      
            <button className="boton-volver" onClick={handleRedirectToGestionTareas}>
                 <img src={atras} alt="Eliminar" />
            </button>

      <h2>Mantenimiento/Monitoreo - Plantación {idPlantacion}</h2>

      {/* Formulario para crear o editar mantenimientos */}
      <MantenimientoMonitoreoForm
        plantacionId={idPlantacion}
        mantenimientoId={mantenimientoId}
        onCreated={loadMantenimientos}
      />

      {/* Historial de Mantenimientos */}
      <h3 className='sub-titulo-form'>Historial de Mantenimientos:</h3>
      {mantenimientos.length === 0 ? (
        <p>No hay mantenimientos registrados.</p>
      ) : (
        <ul className="riego-list">
          {mantenimientos.map((m, index) => (
            <li key={`${m.id}-${index}`} className="riego-item">
              {m.guadana && (
                <p><strong>Guadaña:</strong> {m.guadana}</p>
              )}
              {m.necesidadArboles && (
                <p><strong>Necesidad de Árboles:</strong> {m.necesidadArboles}</p>
              )}
              {m.tipoTratamiento && (
                <p><strong>Tipo Tratamiento:</strong> {m.tipoTratamiento}</p>
              )}
              {m.nombreTratamiento && (
                <p><strong>Nombre de Tratamiento</strong> {m.nombreTratamiento}</p>
              )}
              {m.fechaAplicacionTratamiento && (
                <p><strong>Fecha Aplicación:</strong> {m.fechaAplicacionTratamiento}</p>
              )}
             
              
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}