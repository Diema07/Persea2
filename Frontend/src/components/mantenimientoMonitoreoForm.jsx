import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  getMantenimientoByPlantacionId,
  postMantenimientoMonitoreo,
} from '../api/mantenimientoMonitoreo.api';

export function MantenimientoMonitoreoForm({ plantacionId, onCreated }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
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

  // Efecto para deshabilitar el otro checkbox cuando uno está seleccionado
  useEffect(() => {
    if (watchCheckGuadana) {
      setIsCheckboxDisabled((prev) => ({ ...prev, aplicacion: true }));
    } else if (watchCheckAplicacion) {
      setIsCheckboxDisabled((prev) => ({ ...prev, guadana: true }));
    } else {
      setIsCheckboxDisabled({ guadana: false, aplicacion: false });
    }
  }, [watchCheckGuadana, watchCheckAplicacion]);

  // Cargar datos existentes al montar el componente
  useEffect(() => {
    async function fetchData() {
      try {
        const plantacionIdNumber = Number(plantacionId);
        if (isNaN(plantacionIdNumber)) {
          throw new Error("plantacionId debe ser un número");
        }

        const data = await getMantenimientoByPlantacionId(plantacionIdNumber);

        if (data && data.length > 0) {
          const mantenimiento = data[0];

          setValue('checkGuadana', !!mantenimiento.guadana);
          setValue('checkAplicacion', !!mantenimiento.fechaAplicacionTratamiento);

          setIsCheckboxDisabled({
            guadana: !!mantenimiento.guadana,
            aplicacion: !!mantenimiento.fechaAplicacionTratamiento,
          });

          setValue('necesidadArboles', mantenimiento.necesidadArboles || '');
          setValue('tipoTratamiento', mantenimiento.tipoTratamiento || '');
        }
      } catch (error) {
        console.error('Error al cargar el mantenimiento/monitoreo:', error);
      }
    }
    fetchData();
  }, [plantacionId, setValue]);

  // Asignar fecha de hoy si el checkbox está marcado
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

  // Manejo del submit
  const onSubmit = handleSubmit(async (data) => {
    try {
      const datosParaEnviar = {};

      if (data.checkGuadana) {
        datosParaEnviar.guadana = data.guadana;
      } else {
        datosParaEnviar.guadana = null;
      }

      if (data.checkAplicacion) {
        datosParaEnviar.fechaAplicacionTratamiento = data.fechaAplicacionTratamiento;
        datosParaEnviar.necesidadArboles = data.necesidadArboles;
        datosParaEnviar.tipoTratamiento = data.tipoTratamiento;
      } else {
        datosParaEnviar.fechaAplicacionTratamiento = null;
        datosParaEnviar.necesidadArboles = null;
        datosParaEnviar.tipoTratamiento = null;
      }

      datosParaEnviar.idPlantacion = Number(plantacionId);

      await postMantenimientoMonitoreo(datosParaEnviar);

      if (onCreated) {
        onCreated();
      }

      // Resetear el formulario después de enviar
      reset({
        checkGuadana: false,
        checkAplicacion: false,
        guadana: null,
        fechaAplicacionTratamiento: null,
        necesidadArboles: '',
        tipoTratamiento: '',
      });

      // Restablecer el estado de los checkboxes
      setIsCheckboxDisabled({ guadana: false, aplicacion: false });

    } catch (error) {
      console.error('Error al guardar el mantenimiento/monitoreo:', error);
    }
  });

  return (
    <div className="preparacion-terreno-container">
      <h3>Agregar Mantenimiento/Monitoreo</h3>
      <form className="preparacion-form" onSubmit={onSubmit}>
        {/* GUADAÑA */}
        <div className="form-group">
          <input
            type="checkbox"
            className="form-checkbox"
            {...register('checkGuadana')}
            disabled={isCheckboxDisabled.guadana}
          />
          <label className="form-label">Guadaña</label>
          {watchCheckGuadana && (
            <span className="form-fecha">
              (Fecha: {watch('guadana')})
            </span>
          )}
        </div>

       
        {/* FECHA DE APLICACIÓN DE TRATAMIENTO */}
        <div className="form-group">
          <input
            type="checkbox"
            className="form-checkbox"
            {...register('checkAplicacion')}
            disabled={isCheckboxDisabled.aplicacion}
          />
          <label className="form-label">
          Aplicación de Tratamiento
          </label>
          {watchCheckAplicacion && (
            <span className="form-fecha">
              (Fecha: {watch('fechaAplicacionTratamiento')})
            </span>
          )}
        </div>

        {/* Mostrar campos de aplicación de tratamiento solo si el checkbox está marcado */}
        {watchCheckAplicacion && (
          <>
            <div style={{ marginBottom: '8px' }}>
              <label>Necesidad de Árboles:</label>
              <input
                type="text"
                {...register('necesidadArboles', { required: true })}
                style={{ marginLeft: '8px' }}
              />
              {errors.necesidadArboles && <span style={{ color: 'red' }}>Este campo es requerido</span>}
            </div>

            <div style={{ marginBottom: '8px' }}>
              <label>Tipo de Tratamiento:</label>
              <select
                {...register('tipoTratamiento', { required: true })}
                style={{ marginLeft: '8px' }}
              >
                <option value=""></option>
                <option value="insecticida">Insecticida</option>
                <option value="fungicida">Fungicida</option>
                <option value="herbicida">Herbicida</option>
              </select>
              {errors.tipoTratamiento && <span style={{ color: 'red' }}>Este campo es requerido</span>}
            </div>
          </>
        )}

        <button style={{ marginTop: '16px' }}>Listo</button>
      </form>
    </div>
  );
}
