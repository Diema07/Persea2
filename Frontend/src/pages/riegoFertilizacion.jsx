// RiegoFertilizacionPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRiegoByPlantacionId } from '../api/riegoFertilizacion.api';
import { getPlantacionById } from '../api/plantaciones.api';
import { RiegoFertilizacionForm } from '../components/riegoFertilizacionForm';
import '../styles/historial.css';
import logo8 from "../img/img8.png";

export function RiegoFertilizacionPage() {
  const { plantacionId } = useParams();
  const idPlantacion = Number(plantacionId);
  const [riego, setRiego] = useState([]);
  // const [idRiegoEdit, setIdRiegoEdit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nombreParcela, setNombreParcela] = useState('');
  const navigate = useNavigate();

  // Carga los registros de Riego/Fertilización existentes
  const loadRiegoFertilizacion = async () => {
    if (!idPlantacion) {
      setError("plantacionId es undefined o no es un número");
      return;
    }
    setLoading(true);
    try {
      const data = await getRiegoByPlantacionId(idPlantacion);
      setRiego(data || []);
      setError(null);
    } catch (error) {
      console.error('Error al obtener Riego/Fertilización:', error);
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
      loadRiegoFertilizacion();
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
          Riego y Fertilización - Plantación {nombreParcela || idPlantacion}
        </h2>
  
        {/* Mensaje de error */}
        {error && <p className="error-message">{error}</p>}
  
        {/* Formulario para crear o editar riego/fertilización */}
        <RiegoFertilizacionForm
          plantacionId={idPlantacion}
          onCreated={loadRiegoFertilizacion}
        />
  
        {/* Historial de Riego/Fertilización */}
        <h3 className='sub-titulo-form'>Historial de Riego/Fertilización:</h3>
        {loading ? (
          <p>Cargando...</p>
        ) : riego.length === 0 ? (
          <p>No hay registros de Riego/Fertilización.</p>
        ) : (
          <ul className="riego-list">
            {riego.map((r, index) => (
              <li key={`${r.id}-${index}`} className="riego-item">
                {/* Mostrar solo si es riego */}
                {r.fechaRiego && !r.fechaFertilizante && (
                  <>
                  <p><strong>Fecha Riego:</strong> {r.fechaRiego}</p>
                  <p><strong>Tipo de Riego:</strong> {r.tipoRiego}</p>
                  </>
                )}

                {/* Mostrar solo si es Fertilización */}
                {r.fechaFertilizante && !r.fechaRiego && (
                  <>
                    <p><strong>Fecha Fertilización:</strong> {r.fechaFertilizante}</p>
                    <p><strong>Método de Aplicación:</strong> {r.metodoAplicacionFertilizante}</p>
                    <p><strong>Tipo de Fertilizante:</strong> {r.tipoFertilizante}</p>
                    <p><strong>Nombre del Fertilizante:</strong> {r.nombreFertilizante}</p>
                    <p><strong>Cantidad de Fertilizante:</strong> {r.cantidadFertilizante} {r.medidaFertilizante}</p>
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
