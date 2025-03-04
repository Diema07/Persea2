import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMantenimientoByPlantacionId } from '../api/mantenimientoMonitoreo.api';
import { MantenimientoMonitoreoForm } from '../components/mantenimientoMonitoreoForm';

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
      setMantenimientos(data);
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

  // Botón para ir a Preparacion terreno 
  const handleRedirectToGestionTareas = () => {
    navigate(`/gestionTareas/${idPlantacion}`);
  };



  return (
    <div>
      <h2>Mantenimiento/Monitoreo - Plantación {idPlantacion}</h2>

      {/* Formulario con checkboxes y fechas automáticas */}
      <MantenimientoMonitoreoForm
        plantacionId={idPlantacion}
        mantenimientoId={mantenimientoId}
        onCreated={loadMantenimientos}
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


      
      {/* (Opcional) Historial de Mantenimientos */}
      <h3>Historial de Mantenimientos:</h3>
      {mantenimientos.length === 0 ? (
        <p>No hay mantenimientos registrados.</p>
      ) : (
        <ul>
          {mantenimientos.map((m) => (
            <li key={m.id}>
              <strong>ID:</strong> {m.id} <br />
              <strong>Guadaña:</strong> {m.guadana || '---'} <br />
              <strong>Necesidad de Árboles:</strong> {m.necesidadArboles || '---'} <br />
              <strong>Tipo Tratamiento:</strong> {m.tipoTratamiento || '---'} <br />
              <strong>Fecha Aplicación:</strong> {m.fechaAplicacionTratamiento || '---'} <br />
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
