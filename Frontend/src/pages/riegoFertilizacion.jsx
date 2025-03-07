import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRiegoByPlantacionId } from '../api/riegoFertilizacion.api';
import { RiegoFertilizacionForm } from '../components/riegoFertilizacionForm';
import atras from "../img/atras.png";


export function RiegoFertilizacionPage() {
  const { plantacionId } = useParams();
  const idPlantacion = Number(plantacionId);
  const [riegoList, setRiegoList] = useState([]);
  const [idRiegoEdit, setIdRiegoEdit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
      setRiegoList(data || []);
      setError(null);
    } catch (error) {
      console.error('Error al obtener Riego/Fertilización:', error);
      setError('Error al cargar los datos. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar la página
  useEffect(() => {
    if (idPlantacion) {
      loadRiegoFertilizacion();
    }
  }, [idPlantacion]);

  // Cuando se guarde un registro, recargamos y cerramos el formulario
  const handleUpdated = () => {
    loadRiegoFertilizacion();
    setIdRiegoEdit(null);
  };

  // Botón para ir a Gestión de Tareas
  const handleRedirectToGestionTareas = () => {
    navigate(`/gestionTareas/${idPlantacion}`);
  };

  return (
    <div className="riego-fertilizacion-container">

      
      <button
        onClick={handleRedirectToGestionTareas}
      >
        <img 
          src={atras} 
          alt="Flecha atras" 
          style={{ width: '35px', height: '35px' }} // Ajusta el tamaño de la flecha
        />
      </button>

      <h2>Riego y Fertilización - Plantación {idPlantacion}</h2>

      {error && <p className="error-message">{error}</p>}

      <RiegoFertilizacionForm
        plantacionId={idPlantacion}
        riegoId={idRiegoEdit}
        onCreated={handleUpdated}
      />


      <h3>Historial de Riego/Fertilización:</h3>
      {loading ? (
        <p>Cargando...</p>
      ) : riegoList.length === 0 ? (
        <p>No hay registros de Riego/Fertilización.</p>
      ) : (
        <ul className="riego-list">
          {riegoList.map((r, index) => (
            <li key={`${r.id}-${index}`} className="riego-item">
              {r.fechaRiego && (
                <p><strong>Fecha Riego:</strong> {r.fechaRiego}</p>
              )}
              {r.fechaFertilizante && (
                <p><strong>Fecha Fertilización:</strong> {r.fechaFertilizante}</p>
              )}
              {r.tipoRiego && (
                <p><strong>Tipo de Riego:</strong> {r.tipoRiego}</p>
              )}
              {r.metodoAplicacionFertilizante && (
                <p><strong>Método de Aplicación:</strong> {r.metodoAplicacionFertilizante}</p>
              )}
              {r.tipoFertilizante && (
                <p><strong>Tipo de Fertilizante:</strong> {r.tipoFertilizante}</p>
              )}
              {r.nombreFertilizante && (
                <p><strong>Nombre del Fertilizante:</strong> {r.nombreFertilizante}</p>
              )}
              {(r.cantidadFertilizante || r.medidaFertilizante) && (
                <p>
                  <strong>Cantidad de Fertilizante:</strong> {r.cantidadFertilizante} {r.medidaFertilizante}
                </p>
              )}
              
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
