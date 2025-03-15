// src/components/informeGeneralSelect.jsx
import React, { useState } from 'react';

const PlantacionCompletasSelect = ({ plantaciones, onSelect, onSubSelect }) => {
  const [selectedPlantacionId, setSelectedPlantacionId] = useState('');
  const [selectedSubOption, setSelectedSubOption] = useState('');

  // Agrupamos las plantaciones por nombre único (nombreParcela)
  const uniquePlantaciones = Array.from(
    new Set(plantaciones.map(p => p.nombreParcela))
  ).map(nombre => plantaciones.find(p => p.nombreParcela === nombre));

  const handleChange = (event) => {
    const selectedId = event.target.value;
    setSelectedPlantacionId(selectedId);
    if (onSelect) onSelect(selectedId);
    // Reiniciamos la subopción al cambiar la plantación
    setSelectedSubOption('');
  };

  const handleSubChange = (event) => {
    const value = event.target.value;
    setSelectedSubOption(value);
    if (onSubSelect) onSubSelect(value);
  };

  return (
    <div>
      <select onChange={handleChange} value={selectedPlantacionId}>
        <option value="">Seleccione una plantación</option>
        {uniquePlantaciones.map((plantacion) => (
          <option key={plantacion.id} value={plantacion.id}>
            {plantacion.nombreParcela}
          </option>
        ))}
      </select>
      {selectedPlantacionId && (
        <div style={{ marginTop: '20px' }}>
          <label htmlFor="sub-select">Seleccione una opción adicional:</label>
          <select id="sub-select" onChange={handleSubChange} value={selectedSubOption}>
            <option value="">Seleccione una opción</option>
            <option value="opcion1">Opción 1</option>
            <option value="opcion2">Opción 2</option>
            <option value="opcion3">Opción 3</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default PlantacionCompletasSelect;
