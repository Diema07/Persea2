// src/components/MantenimientoMonitoreoForm.jsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  getMantenimientoByPlantacionId,
  postMantenimientoMonitoreo
} from '../api/mantenimientoMonitoreo.api';

export function MantenimientoMonitoreoForm({ plantacionId, onCreated }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  // Estado para controlar si los checkboxes están deshabilitados
  const [isCheckboxDisabled, setIsCheckboxDisabled] = useState({
    guadana: false,
    aplicacion: false,
  });

  // Observar checkboxes
  const watchCheckGuadana = watch('checkGuadana');
  const watchCheckAplicacion = watch('checkAplicacion');

  // Al montar, obtenemos si ya existe un registro (opcional)
  useEffect(() => {
    async function fetchData() {
      try {
        const plantacionIdNumber = Number(plantacionId);
        if (isNaN(plantacionIdNumber)) {
          throw new Error("plantacionId debe ser un número");
        }

        const data = await getMantenimientoByPlantacionId(plantacionIdNumber);

        // Si hay un registro existente, puedes usarlo para deshabilitar checkboxes
        // o mostrar un mensaje. Opcional:
        if (data && data.length > 0) {
          const mantenimiento = data[0];

          // Asignar checkboxes si ya tienen fecha
          setValue('checkGuadana', !!mantenimiento.guadana);
          setValue('checkAplicacion', !!mantenimiento.fechaAplicacionTratamiento);

          setIsCheckboxDisabled({
            guadana: !!mantenimiento.guadaña,
            aplicacion: !!mantenimiento.fechaAplicacionTratamiento,
          });

          // Prellenar campos de texto si quieres
          setValue('necesidadArboles', mantenimiento.necesidadArboles || '');
          setValue('tipoTratamiento', mantenimiento.tipoTratamiento || '');
        }
      } catch (error) {
        console.error('Error al cargar el mantenimiento/monitoreo:', error);
      }
    }
    fetchData();
  }, [plantacionId, setValue]);

  // Cada vez que cambie un checkbox, asignamos fecha de hoy o null
  useEffect(() => {
    if (watchCheckGuadana) {
      setValue('guadana', new Date().toISOString().split('T')[0]);
    } else {
      setValue('guadana', null);
    }
  }, [watchCheckGuadana, setValue]);

  useEffect(() => {
    if (watchCheckAplicacion) {
      setValue('fechaAplicacionTratamiento', new Date().toISOString().split('T')[0]);
    } else {
      setValue('fechaAplicacionTratamiento', null);
    }
  }, [watchCheckAplicacion, setValue]);

  // Manejo del submit: CREAR (POST) un nuevo mantenimiento
  const onSubmit = handleSubmit(async (data) => {
    try {
      // Construir el objeto con los campos relevantes
      
      const datosParaEnviar = {};

      if (data.checkGuadana) {
        datosParaEnviar.guadana = data.guadana;
      }
      if (data.checkAplicacion) {
        datosParaEnviar.fechaAplicacionTratamiento = data.fechaAplicacionTratamiento;
      }
      if (data.necesidadArboles) {
        datosParaEnviar.necesidadArboles = data.necesidadArboles;
      }
      if (data.tipoTratamiento) {
        datosParaEnviar.tipoTratamiento = data.tipoTratamiento;
      }

      // Asignar la plantación a la que pertenece
      datosParaEnviar.idPlantacion = Number(plantacionId);

      // Llamamos al POST, sin pasar ningún ID en la URL
      await postMantenimientoMonitoreo(datosParaEnviar);

      // Recargar la página tras crear
      if (onCreated) {
        onCreated();
      }
    } catch (error) {
      console.error('Error al crear el mantenimiento/monitoreo:', error);
    }
  });

  return (
    <div>
      <h3>Agregar Mantenimiento/Monitoreo</h3>
      <form onSubmit={onSubmit}>
        {/* GUADAÑA */}
        <div style={{ marginBottom: '8px' }}>
          <input
            type="checkbox"
            {...register('checkGuadana')}
          />
          <label style={{ marginLeft: '8px' }}>Guadaña</label>
          {watchCheckGuadana && (
            <span style={{ marginLeft: '16px', color: 'green' }}>
              (Fecha: {watch('guadana')})
            </span>
          )}
        </div>

        {/* NECESIDAD DE ÁRBOLES */}
        <div style={{ marginBottom: '8px' }}>
          <label>Necesidad de Árboles:</label>
          <input
            type="text"
            {...register('necesidadArboles', { required: false })}
            style={{ marginLeft: '8px' }}
          />
          {errors.necesidadArboles && <span style={{ color: 'red' }}></span>}
        </div>

        {/* TIPO DE TRATAMIENTO */}
        <div style={{ marginBottom: '8px' }}>
          <label>Tipo de Tratamiento:</label>
          <select
            {...register('tipoTratamiento', { required: false })}
            style={{ marginLeft: '8px' }}
          >
            <option value="">-- Seleccione una opción --</option>
            <option value="insecticida">Insecticida</option>
            <option value="fungicida">Fungicida</option>
            <option value="herbicida">Herbicida</option>
          </select>
          {errors.tipoTratamiento && <span style={{ color: 'red' }}></span>}
        </div>

        {/* FECHA DE APLICACIÓN DE TRATAMIENTO */}
        <div style={{ marginBottom: '8px' }}>
          <input
            type="checkbox"
            {...register('checkAplicacion')}
          />
          <label style={{ marginLeft: '8px' }}>
            Fecha de Aplicación de Tratamiento
          </label>
          {watchCheckAplicacion && (
            <span style={{ marginLeft: '16px', color: 'green' }}>
              (Fecha: {watch('fechaAplicacionTratamiento')})
            </span>
          )}
        </div>

        <button style={{ marginTop: '16px' }}>Listo</button>
      </form>
    </div>
  );
}
