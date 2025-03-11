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
          setValue('nombreTratamiento', mantenimiento.nombreTratamiento || '');
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
        datosParaEnviar.nombreTratamiento = data.nombreTratamiento;
        datosParaEnviar.cantidadTratamiento = data.cantidadTratamiento;
        datosParaEnviar.medidaTratamiento = data.medidaTratamiento;
      } else {
        datosParaEnviar.fechaAplicacionTratamiento = null;
        datosParaEnviar.necesidadArboles = null;
        datosParaEnviar.tipoTratamiento = null;
        datosParaEnviar.nombreTratamiento = null;
        datosParaEnviar.cantidadTratamiento = null;
        datosParaEnviar.medidaTratamiento = null;
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
        nombreTratamiento: '',
        cantidadTratamiento: '',
        medidaTratamiento: '',
        
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
          <label className="form-label">Aplicación de Tratamiento</label>
          {watchCheckAplicacion && (
            <span className="form-fecha">
              (Fecha: {watch('fechaAplicacionTratamiento')})
            </span>
          )}
        </div>

        {/* Mostrar campos de aplicación de tratamiento solo si el checkbox está marcado */}
        {watchCheckAplicacion && (
          <>
            <div className="form-group">
              <label className="form-label">Necesidad de Árboles:</label>
              <input
                type="text"
                {...register('necesidadArboles', { required: true })}
                className="form-input"
              />
              {errors.necesidadArboles && (
                <span className="form-error">Este campo es requerido</span>
              )}
            </div>



            <div className="form-group">
              <label className="form-label">Tipo de Tratamiento:</label>
              <select
                {...register('tipoTratamiento', { required: true })}
                className="form-input"
              >
                <option value=""></option>
                <option value="insecticida">Insecticida</option>
                <option value="fungicida">Fungicida</option>
                <option value="herbicida">Herbicida</option>
              </select>
              {errors.tipoTratamiento && (
                <span className="form-error">Este campo es requerido</span>
              )}
              
            </div>


            <div className="form-group">
              <label className="form-label">Nombre de Tratamiento:</label>
              <input
                type="text"
                {...register('nombreTratamiento', { required: true })}
                className="form-input"
              />
             {errors.nombreTratamiento && (
                <span className="form-error">Este campo es requerido</span>
              )}
            </div>


            <div className="form-group">
              <label className="form-label">Cantidad Tratamiento:</label>
              <input
                type="text"
                {...register('cantidadTratamiento', { required: true })}
                className="form-input"
              />
             {errors.cantidadTratamiento && (
                <span className="form-error">Este campo es requerido</span>
              )}
            </div>


            <div className="form-group">
              <label className="form-label">Medida Tratamiento</label>
              <select
                {...register('medidaTratamiento', { required: true })}
                className="form-input"
              >
                <option value=""></option>
                <option value="kg">kg</option>
                <option value="litros">litros</option>
                <option value="toneladas">toneladas</option>
              </select>
              {errors.medidaTratamiento && <span className="form-error"></span>}
            </div>
          </>
        )}

        <button type="submit" className="form-button">Listo</button>
      </form>
    </div>
);
}
