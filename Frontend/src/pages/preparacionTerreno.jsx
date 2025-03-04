import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {getPreparacionByPlantacionId,} from '../api/preparacionTerreno.api';
import { PreparacionTerrenoForm } from '../components/preparacionTerrenoForm';

export function PreparacionTerrenoPage() {
  const { plantacionId } = useParams();
  const idPlantacion = Number(plantacionId); // Convierte plantacionId a número
  const [preparaciones, setPreparaciones] = useState([]);
  const navigate = useNavigate(); // Hook para redireccionar


  // Cargar las preparaciones existentes
  const loadPreparaciones = async () => {
    if (!idPlantacion) {
      console.error("plantacionId es undefined o no es un número");
      return;
    }
    try {
      const data = await getPreparacionByPlantacionId(idPlantacion);
      setPreparaciones(data);
    } catch (error) {
      console.error('Error al obtener preparaciones:', error);
    }
  };

  useEffect(() => {
    if (idPlantacion) {
      loadPreparaciones();
    }
  }, [idPlantacion]);

  // Obtener el ID de la primera preparación (si existe)
  const preparacionId = preparaciones.length > 0 ? preparaciones[0].id : null;

  // Función para redirigir a la página de selección de árboles
  const handleRedirectToGestionTareas = () => {
    navigate(`/gestionTareas/${idPlantacion}`); // Cambia la ruta según tu configuración
  };


  return (
    <div>
      <h2>Preparación de Terreno - Plantación {idPlantacion}</h2>

      {/* Formulario con checkboxes y fechas automáticas */}
      <PreparacionTerrenoForm
        plantacionId={idPlantacion} // Pasar el ID convertido a número
        preparacionId={preparacionId}
        onCreated={loadPreparaciones}
      />

      {/* Botón para redirigir a la página de selección de árboles */}
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


      {/* Listado de preparaciones (historial) */}
      {/* <h3>Historial de Preparaciones:</h3>
      {preparaciones.length === 0 ? (
        <p>No hay preparaciones registradas.</p>
      ) : (
        <ul>
          {preparaciones.map((prep) => (
            <li key={prep.id}>
              <strong>ID:</strong> {prep.id} <br />
              <strong>Limpieza:</strong> {prep.limpiezaTerreno || 'No definida'} <br />
              <strong>Análisis:</strong> {prep.analisisSuelo || 'No definido'} <br />
              <strong>Corrección:</strong> {prep.correcionSuelo || 'No definida'} <br />
              <strong>Labranza:</strong> {prep.labranza || 'No definida'} <br />
              <strong>Delimitación:</strong> {prep.delimitacionParcela || 0} m²
              <hr />
            </li>
          ))}
        </ul>
      )} */}
    </div>
  );
}