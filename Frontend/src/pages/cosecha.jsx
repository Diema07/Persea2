import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCosechaByPlantacionId } from '../api/cosecha.api';
import { CosechaForm } from '../components/cosechaForm';

export function CosechaPage() {
  const { plantacionId } = useParams();
  const [cosechas, setCosechas] = useState([]);
  const navigate = useNavigate();

  // Carga los registros de cosecha existentes
  const loadCosechas = async () => {
    if (!plantacionId) {
      console.error("plantacionId es undefined o no es un número");
      return;
    }
    try {
      const data = await getCosechaByPlantacionId(Number(plantacionId));
      setCosechas(data || []);
    } catch (error) {
      console.error('Error al obtener registros de cosecha:', error);
    }
  };

  // Al montar o cambiar de plantacionId, carga las cosechas
  useEffect(() => {
    if (plantacionId) {
      loadCosechas();
    }
  }, [plantacionId]);

  // Botón para ir a Gestión de Tareas 
  const handleRedirectToGestionTareas = () => {
    navigate(`/gestionTareas/${plantacionId}`);
  };

  return (
    <div>
      <h2>Cosecha - Plantación {plantacionId}</h2>

      {/* Formulario para crear/actualizar cosechas */}
      <CosechaForm
        plantacionId={plantacionId}
        onCreated={loadCosechas}  // callback para recargar la lista
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

      <h3>Historial de Cosechas</h3>
      {cosechas.length === 0 ? (
        <p>No hay cosechas registradas.</p>
      ) : (
        <ul>
          {cosechas.map((c) => (
            <li key={c.id}>
              <strong>ID:</strong> {c.id} <br />
              <strong>Fecha de Cosecha:</strong> {c.fechaCosecha || '---'} <br />
              <strong>Cantidad Alta Calidad:</strong> {c.cantidadAltaCalidad || 0} kg<br />
              <strong>Cantidad Mediana Calidad:</strong> {c.cantidadMedianaCalidad || 0} kg<br />
              <strong>Cantidad Baja Calidad:</strong> {c.cantidadBajaCalidad || 0} kg<br />
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
