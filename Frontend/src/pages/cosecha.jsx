import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCosechaByPlantacionId } from '../api/cosecha.api';
import { CosechaForm } from '../components/cosechaForm';
import atras from "../img/atras.png";


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

<button
  onClick={handleRedirectToGestionTareas}
>
  <img 
    src={atras} 
    alt="Flecha atras" 
    style={{ width: '35px', height: '35px' }} // Ajusta el tamaño de la flecha
  />
</button>


      <h2>Cosecha - Plantación {plantacionId}</h2>

      {/* Formulario para crear/actualizar cosechas */}
      <CosechaForm
        plantacionId={plantacionId}
        onCreated={loadCosechas}  // callback para recargar la lista
      />

      <h3>Historial de Cosechas</h3>
      {cosechas.length === 0 ? (
        <p>No hay cosechas registradas.</p>
      ) : (
        <ul>
          {cosechas.map((c) => (
            <li key={c.id}>
              <strong>Fecha de Cosecha:</strong> {c.fechaCosecha || '---'} <br />
              <strong>Cantidad Alta Calidad:</strong> {c.cantidadAltaCalidad || 0} kg<br />
              <strong>Cantidad Mediana Calidad:</strong> {c.cantidadMedianaCalidad || 0} kg<br />
              <strong>Cantidad Baja Calidad:</strong> {c.cantidadBajaCalidad || 0} kg<br />
              <strong>Total Cantidad:</strong> {c.cantidadTotal || 0} kg<br />
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
