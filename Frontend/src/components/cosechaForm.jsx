// src/components/CosechaForm.jsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
// Ajusta las siguientes importaciones según tu API real
import { getCosechaByPlantacionId, postCosecha, } from '../api/cosecha.api';

export function CosechaForm({ plantacionId, onCreated }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  // Estado para controlar si el checkbox de fecha está deshabilitado
  const [isCheckboxDisabled, setIsCheckboxDisabled] = useState(false);

  // Observamos el checkbox para asignar fecha o null
  const watchCheckCosecha = watch('checkCosecha');

  // Al montar, obtenemos si ya existe un registro (opcional)
  useEffect(() => {
    async function fetchData() {
      try {
        const plantacionIdNumber = Number(plantacionId);
        if (isNaN(plantacionIdNumber)) {
          throw new Error("plantacionId debe ser un número");
        }

        // Si quieres un solo registro por plantación, podrías usar getCosechaByPlantacionId(plantacionIdNumber).
        // O si tienes varios, y usas cosechaId, ajusta la lógica.
        const data = await getCosechaByPlantacionId(plantacionIdNumber);

        // Si hay un registro existente, úsalo para prellenar
        if (data && data.length > 0) {
          const cosecha = data[0]; // o filtra el que quieras

          // Asignar checkbox si ya tiene fecha
          setValue('checkCosecha', !!cosecha.fechaCosecha);
          setIsCheckboxDisabled(!!cosecha.fechaCosecha);

          // Prellenar campos
          setValue('cantidadCosechada', cosecha.cantidadCosechada || '');
          setValue('kilosCalidadExportacion', cosecha.kilosCalidadExportacion || '');
          setValue('kilosCalidadNacional', cosecha.kilosCalidadNacional || '');
          setValue('kilosCalidadIndustrial', cosecha.kilosCalidadIndustrial || '');
        }
      } catch (error) {
        console.error('Error al cargar la cosecha:', error);
      }
    }
    fetchData();
  }, [plantacionId, setValue]);

  // Cada vez que cambie el checkbox, asignamos fecha de hoy o null
  useEffect(() => {
    if (watchCheckCosecha) {
      setValue('fechaCosecha', new Date().toISOString().split('T')[0]);
    } else {
      setValue('fechaCosecha', null);
    }
  }, [watchCheckCosecha, setValue]);

  // Manejo del submit: CREAR (POST) o ACTUALIZAR (PATCH)
  const onSubmit = handleSubmit(async (data) => {
    try {
      const datosParaEnviar = {
        // Campos básicos
        cantidadCosechada: data.cantidadCosechada || 0,
        kilosCalidadExportacion: data.kilosCalidadExportacion || 0,
        kilosCalidadNacional: data.kilosCalidadNacional || 0,
        kilosCalidadIndustrial: data.kilosCalidadIndustrial || 0,
        idPlantacion: Number(plantacionId),
      };

      // Si el checkbox está marcado, enviamos la fecha
      if (data.checkCosecha) {
        datosParaEnviar.fechaCosecha = data.fechaCosecha;
      } else {
        datosParaEnviar.fechaCosecha = null;
      }

      // Decidir si creamos o actualizamos
  
        await postCosecha(datosParaEnviar);
      

      // Llamar callback o recargar
      if (onCreated) {
        onCreated();
      }
    } catch (error) {
      console.error('Error al guardar la cosecha:', error);
    }
  });

  return (
    <div>
      <h3>Agregar cosecha </h3>
      <form onSubmit={onSubmit}>
        {/* CHECKBOX PARA FECHA */}
        <div style={{ marginBottom: '8px' }}>
          <input
            type="checkbox"
            {...register('checkCosecha')}
          />
          <label style={{ marginLeft: '8px' }}>
            Fecha de Cosecha (hoy si marcas)
          </label>
          {watchCheckCosecha && (
            <span style={{ marginLeft: '16px', color: 'green' }}>
              (Fecha: {watch('fechaCosecha')})
            </span>
          )}
        </div>

        {/* CANTIDAD TOTAL COSECHADA */}
        <div style={{ marginBottom: '8px' }}>
          <label>Total Cosecha (kg):</label>
          <input
            type="number"
            step="any"
            {...register('cantidadCosechada', { required: true })}
            style={{ marginLeft: '8px' }}
          />
          {errors.cantidadCosechada && (
            <span style={{ color: 'red', marginLeft: '8px' }}>Requerido</span>
          )}
        </div>

        {/* CALIDAD EXPORTACIÓN */}
        <div style={{ marginBottom: '8px' }}>
          <label>Calidad Exportación (kg):</label>
          <input
            type="number"
            step="any"
            {...register('kilosCalidadExportacion', { required: false })}
            style={{ marginLeft: '8px' }}
          />
        </div>

        {/* CALIDAD NACIONAL */}
        <div style={{ marginBottom: '8px' }}>
          <label>Calidad Nacional (kg):</label>
          <input
            type="number"
            step="any"
            {...register('kilosCalidadNacional', { required: false })}
            style={{ marginLeft: '8px' }}
          />
        </div>

        {/* CALIDAD INDUSTRIAL */}
        <div style={{ marginBottom: '8px' }}>
          <label>Calidad Industrial (kg):</label>
          <input
            type="number"
            step="any"
            {...register('kilosCalidadIndustrial', { required: false })}
            style={{ marginLeft: '8px' }}
          />
        </div>
        <button style={{ marginTop: '16px' }}>Listo</button>
      </form>
    </div>
  );
}
