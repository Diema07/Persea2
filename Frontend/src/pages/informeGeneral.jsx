// src/pages/informeGeneral.jsx
import React, { useEffect, useState } from 'react';
import { getPlantacionesCompletas } from '../api/plantaciones.api';
import PlantacionCompletasSelect from '../components/informeGeneralSelect';

export const InformeGeneralPage = () => {
  // Obtenemos el id del usuario desde localStorage
  const userId = localStorage.getItem('userId');
  const [plantaciones, setPlantaciones] = useState([]);
  const [selectedPlantacionId, setSelectedPlantacionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSubOption, setSelectedSubOption] = useState('');

  useEffect(() => {
    const fetchPlantaciones = async () => {
      setLoading(true);
      try {
        const response = await getPlantacionesCompletas();
        setPlantaciones(response.data);
      } catch (err) {
        setError('Error al cargar las plantaciones completas');
      } finally {
        setLoading(false);
      }
    };
    fetchPlantaciones();
  }, []);

  const handleSelect = (plantacionId) => {
    setSelectedPlantacionId(plantacionId);
  };

  const handleSubSelect = (option) => {
    setSelectedSubOption(option);
  };

  return (
    <div>
      <h1>Informe de Plantaciones Completas para el Usuario {userId}</h1>
      {loading && <p>Cargando plantaciones...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <PlantacionCompletasSelect 
          plantaciones={plantaciones}
          onSelect={handleSelect}
          onSubSelect={handleSubSelect}
        />
      )}
      {selectedPlantacionId && (
        <div style={{ marginTop: '20px' }}>
          <p>Plantación seleccionada: {selectedPlantacionId}</p>
          {selectedSubOption && (
            <p>Opción adicional seleccionada: {selectedSubOption}</p>
          )}
        </div>
      )}
    </div>
  );
};
