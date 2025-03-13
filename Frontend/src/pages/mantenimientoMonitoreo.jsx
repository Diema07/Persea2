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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Carga los registros de Mantenimiento/Monitoreo existentes
  const loadMantenimientos = async () => {
    if (!idPlantacion) {
      setError("plantacionId es undefined o no es un número");
      return;
    }
    setLoading(true);
    try {
      const data = await getMantenimientoByPlantacionId(idPlantacion);
      console.log("Datos recibidos en el frontend:", data); // 🔍 Agregar esta línea
      setMantenimientos(data || []);
      setError(null);
    } catch (error) {
      console.error('Error al obtener Mantenimiento/Monitoreo:', error);
      setError('Error al cargar los datos. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar la página
  useEffect(() => {
    if (idPlantacion) {
      loadMantenimientos();
    }
  }, [idPlantacion]);

  // Botón para ir a Gestión de Tareas
  const handleRedirectToGestionTareas = () => {
    navigate(`/gestionTareas/${idPlantacion}`);
  };

  return (
    <div className="riego-fertilizacion-container">
      
            <button className="boton-volver" onClick={handleRedirectToGestionTareas}>
                 <img src={atras} alt="Eliminar" />
            </button>

      <h2 className='subtitulo-principal'>Mantenimiento/Monitoreo - Plantación {idPlantacion}</h2>

      {error && <p className="error-message">{error}</p>}

      {/* Formulario para crear o editar mantenimientos */}
      <MantenimientoMonitoreoForm
        plantacionId={idPlantacion}
        onCreated={loadMantenimientos}
      />

      {/* Historial de Mantenimientos */}
      <h3 className='sub-titulo-form'>Historial de Mantenimiento/Monitoreo:</h3>
      {loading ? (
        <p>Cargando...</p>
      ) : mantenimientos.length === 0 ? (
        <p>No hay registros de Mantenimiento/Monitoreo.</p>
      ) : (
        <ul className="riego-list">
          {mantenimientos.map((m, index) => (
            <li key={`${m.id}-${index}`} className="riego-item">
              {/* Mostrar solo si es guadaña */}
              {m.guadana && !m.fechaAplicacionTratamiento && (
                <p><strong>Guadaña:</strong> {m.guadana}</p>
              )}

              {/* Mostrar solo si es fumigación */}
              {m.fechaAplicacionTratamiento && !m.guadana && (
                <>
                  <p><strong>Fumigación:</strong> {m.fechaAplicacionTratamiento}</p>
                  <p><strong>Método de Aplicación:</strong> {m.metodoAplicacionFumigacion}</p>
                  <p><strong>Tipo de Tratamiento:</strong> {m.tipoTratamiento}</p>
                  <p><strong>Nombre de Tratamiento:</strong> {m.nombreTratamiento}</p>
                  <p><strong>Cantidad:</strong> {m.cantidadTratamiento} {m.medidaTratamiento}</p>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}