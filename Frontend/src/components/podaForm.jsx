import React, {} from 'react';
import { useForm } from 'react-hook-form';
import { postPoda } from '../api/poda.api';

export function PodaForm({ plantacionId, onCreated }) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const watchTipoPoda = watch('tipoPoda');

  const sugerenciasPoda = {
    formacion: {
      frecuencia: "1-2 veces/año",
      epoca: "Primavera y Otoño",
      herramientas: "Tijeras, serrucho",
      tecnicas: "Deschuponado, raleo, despunte"
    },
    mantenimiento: {
      frecuencia: "1 vez/año",
      epoca: "Después de la cosecha",
      herramientas: "Tijeras, serrucho, motosierra",
      tecnicas: "Raleo, deschuponado, rebaje"
    },
    sanitaria: {
      frecuencia: "Segun necesidad",
      epoca: "Cualquier época",
      herramientas: "Serrucho, tijeras",
      tecnicas: "Rebaje, raleo"
    
    },
    rejuvenecimiento: {
      frecuencia: "Cada 5-10 años",
      epoca: "Después de la cosecha",
      herramientas: "Serrucho, motosierra",
      tecnicas: "Rebaje, raleo, deschuponado"
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const datosParaEnviar = {
        idPlantacion: Number(plantacionId),
        tipoPoda: data.tipoPoda,
        herramientasUsadas: data.herramientasUsadas,
        tecnicasUsadas: data.tecnicasUsadas
      };

      await postPoda(datosParaEnviar);
      if (onCreated) {
        onCreated();
      }

      reset();
    } catch (error) {
      console.error('Error al crear Poda:', error);
    }
  });

  return (
    <div className="contenedor-principal">
      {/* Formulario */}
      <div className="preparacion-terreno-container">
        <h3>Agregar Poda</h3>
        <form className="preparacion-form" onSubmit={onSubmit}>
          {/* Tipo de Poda */}
          <div className="form-group">
            <label className="form-label">Tipo de Poda:</label>
            <select className="form-input" {...register('tipoPoda', { required: true })}>
              <option value=""></option>
              <option value="formacion">Formación</option>
              <option value="mantenimiento">Mantenimiento</option>
              <option value="sanitaria">Sanitaria</option>
              <option value="rejuvenecimiento">Rejuvenecimiento</option>
            </select>
            {errors.tipoPoda && <span className="form-error">Requerido</span>}
          </div>
  
          {/* Herramientas Usadas */}
          <div className="form-group">
            <label className="form-label">Herramientas Usadas:</label>
            <select className="form-input" {...register('herramientasUsadas', { required: true })}>
              <option value=""></option>
              <option value="tijeras">Tijeras</option>
              <option value="serrucho">Serrucho</option>
              <option value="motosierra">Motosierra</option>
            </select>
            {errors.herramientasUsadas && <span className="form-error">Requerido</span>}
          </div>
  
          {/* Técnicas Usadas */}
          <div className="form-group">
            <label className="form-label">Técnicas Usadas:</label>
            <select className="form-input" {...register('tecnicasUsadas', { required: true })}>
              <option value=""></option>
              <option value="ralo">Raleo</option>
              <option value="deschuponado">Deschuponado</option>
              <option value="rebaje">Rebaje</option>
            </select>
            {errors.tecnicasUsadas && <span className="form-error">Requerido</span>}
          </div>
  
          {/* Botón de guardar */}
          <button className="form-button">Guardar</button>
        </form>
      </div>
  
      {/* Sugerencias de poda dinámicas */}
      {watchTipoPoda && sugerenciasPoda[watchTipoPoda] && (
        <div className="sugerencias">
          <h4>🌳 {watchTipoPoda === "formacion" ? "Poda de Formación" : watchTipoPoda === "mantenimiento" ? "Poda de Mantenimiento" : watchTipoPoda === "sanitaria" ? "Poda Sanitaria" : "Poda de Rejuvenecimiento"}</h4>
          <p><strong>🔄 Frecuencia:</strong> {sugerenciasPoda[watchTipoPoda].frecuencia}</p>
          <p><strong>📅 Época Recomendada:</strong> {sugerenciasPoda[watchTipoPoda].epoca}</p>
          <p><strong>🛠 Herramientas:</strong> {sugerenciasPoda[watchTipoPoda].herramientas}</p>
          <p><strong>✂️ Técnicas Principales:</strong> {sugerenciasPoda[watchTipoPoda].tecnicas}</p>
        </div>
      )}
    </div>
  );
}
