import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRiegoByPlantacionId } from '../api/riegoFertilizacion.api';
import { RiegoFertilizacionForm } from '../components/riegoFertilizacionForm';

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


  // Botón para ir a Preparacion terreno 
  const handleRedirectToGestionTareas = () => {
    navigate(`/gestionTareas/${idPlantacion}`);
  };

  return (
    <div className="riego-fertilizacion-container">
      <h2>Riego y Fertilización - Plantación {idPlantacion}</h2>

      {/* Mostrar mensaje de error si existe */}
      {error && <p className="error-message">{error}</p>}

      {/* Formulario para crear o editar registros */}
      <RiegoFertilizacionForm
        plantacionId={idPlantacion}
        riegoId={idRiegoEdit}
        onCreated={handleUpdated}
      />

      <button
        onClick={handleRedirectToGestionTareas}
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
        Ir a Gestion tareas 
      </button>

      {/* Historial de Riego/Fertilización */}
      <h3>Historial de Riego/Fertilización:</h3>
      {loading ? (
        <p>Cargando...</p>
      ) : riegoList.length === 0 ? (
        <p>No hay registros de Riego/Fertilización.</p>
      ) : (
        <ul className="riego-list">
          {riegoList.map((r) => (
            <li key={r.id} className="riego-item">
              <p><strong>ID:</strong> {r.id}</p>
              <p><strong>Fecha Riego:</strong> {r.fechaRiego || '---'}</p>
              <p><strong>Fecha Fertilización:</strong> {r.fechaFertilizante || '---'}</p>
              <p><strong>Tipo de Riego:</strong> {r.tipoRiego || '---'}</p>
              <p><strong>Método de Aplicación:</strong> {r.metodoAplicacionFertilizante || '---'}</p>
              <p><strong>Tipo de Fertilizante:</strong> {r.tipoFertilizante || '---'}</p>
              <p><strong>Nombre del Fertilizante:</strong> {r.nombreFertilizante || '---'}</p>
              <p><strong>Cantidad de Fertilizante:</strong> {r.cantidadFertilizante || '---'} {r.medidaFertilizante || ''}</p>
              <button
                onClick={() => setIdRiegoEdit(r.id)}
                className="edit-button"
              >
                Editar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}