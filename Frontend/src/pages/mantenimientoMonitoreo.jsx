// MantenimientoMonitoreoPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMantenimientoByPlantacionId } from '../api/mantenimientoMonitoreo.api';
import { getPlantacionById } from '../api/plantaciones.api';
import { MantenimientoMonitoreoForm } from '../components/mantenimientoMonitoreoForm';
import '../styles/historial.css';
import '../styles/formulario.css';
import logo8 from "../img/img8.png";

export function MantenimientoMonitoreoPage() {
  const { plantacionId } = useParams();
  const idPlantacion = Number(plantacionId);
  const [mantenimientos, setMantenimientos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nombreParcela, setNombreParcela] = useState('');
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
      setMantenimientos(data || []);
      setError(null);
    } catch (error) {
      console.error('Error al obtener Mantenimiento/Monitoreo:', error);
      setError('Error al cargar los datos. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos de la plantación (nombreParcela)
  const loadPlantacion = async () => {
    try {
      const response = await getPlantacionById(idPlantacion);
      // Si la respuesta contiene "data", la usamos; de lo contrario, usamos la respuesta directamente.
      const plantacion = response && response.data ? response.data : response;
      if (plantacion && plantacion.nombreParcela) {
        setNombreParcela(plantacion.nombreParcela);
      } else {
        console.warn('La propiedad nombreParcela no se encontró en la respuesta.');
      }
    } catch (error) {
      console.error('Error al obtener datos de la plantación:', error);
    }
  };

  // Cargar datos al montar la página
  useEffect(() => {
    if (idPlantacion) {
      loadMantenimientos();
      loadPlantacion();
    }
  }, [idPlantacion]);

  // Botón para ir a Gestión de Tareas
  const handleRedirectToGestionTareas = () => {
    navigate(`/gestionTareas/${idPlantacion}`);
  };

  return (
  <div className="page-background">
    <div className="page-content">
      {/* Botón de volver */}
      <button className="boton-volver" onClick={handleRedirectToGestionTareas}>
        <img src={logo8} alt="Eliminar" />
        <p className='parrafo-volver'>volver</p>
      </button>

      {/* Título principal */}
      <h2 className='subtitulo-principal'>
        Mantenimiento - Plantación {nombreParcela || idPlantacion}
      </h2>

      {/* Mensaje de error */}
      {error && <p className="error-message">{error}</p>}

      {/* Formulario para crear o editar mantenimientos */}
      <MantenimientoMonitoreoForm
        plantacionId={idPlantacion}
        onCreated={loadMantenimientos}
      />

      {/* Historial de Mantenimientos/Monitoreos */}
      <h3 className='sub-titulo-form'>Historial de Mantenimiento:</h3>
      {loading ? (
        <p>Cargando...</p>
      ) : mantenimientos.length === 0 ? (
        <p>No hay registros de Mantenimiento.</p>
      ) : (
        <ul className="riego-list">
          {mantenimientos.map((m, index) => (
            <li key={`${m.id}-${index}`} className="riego-item">
              {/* Mostrar solo si es guadaña */}
              {m.guadana && !m.fechaAplicacionTratamiento && (
                <p><strong>Fecha Guadaña:</strong> {m.guadana}</p>
              )}

              {/* Mostrar solo si es fumigación */}
              {m.fechaAplicacionTratamiento && !m.guadana && (
                <>
                  <p><strong>Fecha Fumigación:</strong> {m.fechaAplicacionTratamiento}</p>
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
  </div>
);
}
