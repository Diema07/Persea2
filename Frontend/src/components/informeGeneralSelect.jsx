// src/components/informeGeneralSelect.jsx
import React, { useState } from 'react';
import { Header } from './Header'

const PlantacionCompletasSelect = ({ plantaciones, onSelect }) => {
  const [selectedPlantacionId, setSelectedPlantacionId] = useState('');

  // Ordenar las plantaciones de forma descendente según la fechaCosecha
  const sortedPlantaciones = [...plantaciones].sort((a, b) => {
    const fechaA = a.fechaCosecha ? new Date(a.fechaCosecha) : new Date(0);
    const fechaB = b.fechaCosecha ? new Date(b.fechaCosecha) : new Date(0);
    return fechaB - fechaA;
  });

  const handleChange = (event) => {
    const selectedId = event.target.value;
    setSelectedPlantacionId(selectedId);
    if (onSelect) onSelect(selectedId);
  };

  return (
    <>
    <Header/>
    <div>
      <select onChange={handleChange} value={selectedPlantacionId}>
        <option value="">Seleccione una plantación</option>
        {sortedPlantaciones.map((plantacion) => (
          <option key={plantacion.id} value={plantacion.id}>
            {plantacion.nombreParcela} - {plantacion.fechaCosecha || 'Sin fecha'}
          </option>
        ))}
      </select>
    </div>
    </>
  );
  
};

export default PlantacionCompletasSelect;
