import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { getCosechaByPlantacionId, postCosecha } from '../api/cosecha.api';

export function CosechaForm({ plantacionId, onCreated }) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  // Al montar, obtenemos si ya existe un registro para prellenar el formulario
  useEffect(() => {
    async function fetchData() {
      try {
        const plantacionIdNumber = Number(plantacionId);
        if (isNaN(plantacionIdNumber)) {
          throw new Error("plantacionId debe ser un número");
        }

        const data = await getCosechaByPlantacionId(plantacionIdNumber);

        if (data && data.length > 0) {
          const cosecha = data[0];
          setValue('cantidadAltaCalidad', cosecha.cantidadAltaCalidad || '');
          setValue('cantidadMedianaCalidad', cosecha.cantidadMedianaCalidad || '');
          setValue('cantidadBajaCalidad', cosecha.cantidadBajaCalidad || '');
        }
      } catch (error) {
        console.error('Error al cargar la cosecha:', error);
      }
    }
    fetchData();
  }, [plantacionId, setValue]);

  // Manejo del submit: CREAR (POST)
  const onSubmit = handleSubmit(async (data) => {
    try {
      const datosParaEnviar = {
        cantidadAltaCalidad: parseFloat(data.cantidadAltaCalidad) || 0,
        cantidadMedianaCalidad: parseFloat(data.cantidadMedianaCalidad) || 0,
        cantidadBajaCalidad: parseFloat(data.cantidadBajaCalidad) || 0,
        idPlantacion: Number(plantacionId),
      };

      await postCosecha(datosParaEnviar);

      if (onCreated) {
        onCreated();
      }

      reset();
      
    } catch (error) {
      console.error('Error al guardar la cosecha:', error);
    }
  });

  return (
    <div className="preparacion-terreno-container">
      <h3>Agregar Cosecha</h3>
      <form className="preparacion-form" onSubmit={onSubmit}>
        {/* CANTIDAD ALTA CALIDAD */}
        <div className="form-group">
          <label className="form-label">Cantidad Alta Calidad (kg):</label>
          <input
            type="number"
            step="any"
            className="form-input"
            {...register('cantidadAltaCalidad', { required: true })}
          />
          {errors.cantidadAltaCalidad && (
            <span className="form-error">Requerido</span>
          )}
        </div>

        {/* CANTIDAD MEDIANA CALIDAD */}
        <div className="form-group">
          <label className="form-label">Cantidad Mediana Calidad (kg):</label>
          <input
            type="number"
            step="any"
            className="form-input"
            {...register('cantidadMedianaCalidad', { required: true })}
          />
          {errors.cantidadMedianaCalidad && (
            <span className="form-error">Requerido</span>
          )}
        </div>

        {/* CANTIDAD BAJA CALIDAD */}
        <div className="form-group">
          <label className="form-label">Cantidad Baja Calidad (kg):</label>
          <input
            type="number"
            step="any"
            className="form-input"
            {...register('cantidadBajaCalidad', { required: true })}
          />
          {errors.cantidadBajaCalidad && (
            <span className="form-error">Requerido</span>
          )}
        </div>

        <button className="form-button">Listo</button>
      </form>
    </div>
);

  // return (
  //   <div>
  //     <h3>Agregar cosecha</h3>
  //     <form onSubmit={onSubmit}>
  //       {/* CANTIDAD ALTA CALIDAD */}
  //       <div style={{ marginBottom: '8px' }}>
  //         <label>Cantidad Alta Calidad (kg):</label>
  //         <input
  //           type="number"
  //           step="any"
  //           {...register('cantidadAltaCalidad', { required: true })}
  //           style={{ marginLeft: '8px' }}
  //         />
  //         {errors.cantidadAltaCalidad && (
  //           <span style={{ color: 'red', marginLeft: '8px' }}>Requerido</span>
  //         )}
  //       </div>

  //       {/* CANTIDAD MEDIANA CALIDAD */}
  //       <div style={{ marginBottom: '8px' }}>
  //         <label>Cantidad Mediana Calidad (kg):</label>
  //         <input
  //           type="number"
  //           step="any"
  //           {...register('cantidadMedianaCalidad', { required: true })}
  //           style={{ marginLeft: '8px' }}
  //         />
  //         {errors.cantidadMedianaCalidad && (
  //           <span style={{ color: 'red', marginLeft: '8px' }}>Requerido</span>
  //         )}
  //       </div>

  //       {/* CANTIDAD BAJA CALIDAD */}
  //       <div style={{ marginBottom: '8px' }}>
  //         <label>Cantidad Baja Calidad (kg):</label>
  //         <input
  //           type="number"
  //           step="any"
  //           {...register('cantidadBajaCalidad', { required: true })}
  //           style={{ marginLeft: '8px' }}
  //         />
  //         {errors.cantidadBajaCalidad && (
  //           <span style={{ color: 'red', marginLeft: '8px' }}>Requerido</span>
  //         )}
  //       </div>
  //       <button style={{ marginTop: '16px' }}>Listo</button>
  //     </form>
  //   </div>
  // );
}
