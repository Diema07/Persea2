// src/components/informeGeneralSelect.jsx
import React, { useState } from 'react';
import '../styles/infoGeneral.css'


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
  
    <div className="select-container">
      
  <select onChange={handleChange} value={selectedPlantacionId} className="custom-select">
    <option value="" className="informeSelec">Seleccione una plantación</option>
    {sortedPlantaciones.map((plantacion) => (
      <option key={plantacion.id} value={plantacion.id}>
        {plantacion.nombreParcela} - {plantacion.fechaCosecha || 'Sin fecha'}
      </option>
    ))}
  </select>
</div>
 
  );
  
};

export default PlantacionCompletasSelect;
