// src/components/InformeCompletoForm.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { postInforme } from '../api/informe.api';

export function InformeCompletoForm({ plantacionId, onCreated }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Manejo del submit para crear un registro de Informe
  const onSubmit = handleSubmit(async (data) => {
    try {
      // Combinar datos con la plantación (si aplica)
      const informeData = {
        ...data,
        fechaGeneracion: data.fechaGeneracion, // string 'YYYY-MM-DD'
        idPlantacion: plantacionId, // si tu modelo lo requiere
      };

      const response = await postInforme(informeData);
      console.log('Informe creado:', response);

      if (onCreated) onCreated(); // refrescar la lista, etc.
    } catch (error) {
      console.error('Error al crear el informe:', error);
    }
  });

  return (
    <div>
      <h3>Crear Informe</h3>
      <form onSubmit={onSubmit}>
        <div>
          <label>Tipo de Informe:</label>
          <input
            type="text"
            {...register('tipoInforme', { required: true })}
          />
          {errors.tipoInforme && <span style={{ color: 'red' }}>Requerido</span>}
        </div>

        <div>
          <label>Fecha de Generación:</label>
          <input
            type="date"
            {...register('fechaGeneracion', { required: true })}
          />
          {errors.fechaGeneracion && <span style={{ color: 'red' }}>Requerido</span>}
        </div>

        <button type="submit">Guardar</button>
      </form>
    </div>
  );
}
