import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {postRiegoFertilizacion,} from '../api/riegoFertilizacion.api';
import '../styles/formulario.css';

export function RiegoFertilizacionForm({ plantacionId, onCreated }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const [isCheckboxDisabled, setIsCheckboxDisabled] = useState({
    riego: false,
    fertilizante: false,
  });

  const watchCheckRiego = watch('checkRiego');
  const watchCheckFertilizante = watch('checkFertilizante');

  // Efecto para deshabilitar el otro checkbox cuando uno está seleccionado
  useEffect(() => {
    if (watchCheckRiego) {
      setIsCheckboxDisabled((prev) => ({ ...prev, fertilizante: true }));
    } else if (watchCheckFertilizante) {
      setIsCheckboxDisabled((prev) => ({ ...prev, riego: true }));
    } else {
      setIsCheckboxDisabled({ riego: false, fertilizante: false });
    }
  }, [watchCheckRiego, watchCheckFertilizante]);

  // Cargar datos existentes al montar el componente
  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const plantacionIdNumber = Number(plantacionId);
  //       if (isNaN(plantacionIdNumber)) {
  //         throw new Error("plantacionId debe ser un número");
  //       }

  //       const data = await getRiegoByPlantacionId(plantacionIdNumber);

  //       if (data && data.length > 0) {
  //         const riegoFertilizacion = data[0];

  //         setValue('checkRiego', !!riegoFertilizacion.fechaRiego);
  //         setValue('checkFertilizante', !!riegoFertilizacion.fechaFertilizante);

  //         setIsCheckboxDisabled({
  //           riego: !!riegoFertilizacion.fechaRiego,
  //           fertilizante: !!riegoFertilizacion.fechaFertilizante,
  //         });

  //         setValue('tipoRiego', riegoFertilizacion.tipoRiego || '');
  //         setValue('metodoAplicacionFertilizante', riegoFertilizacion.metodoAplicacionFertilizante || '');
  //         setValue('tipoFertilizante', riegoFertilizacion.tipoFertilizante || '');
  //         setValue('nombreFertilizante', riegoFertilizacion.nombreFertilizante || '');
  //         setValue('cantidadFertilizante', riegoFertilizacion.cantidadFertilizante || '');
  //         setValue('medidaFertilizante', riegoFertilizacion.medidaFertilizante || '');
  //       }
  //     } catch (error) {
  //       console.error('Error al cargar el riego/fertilización:', error);
  //     }
  //   }
  //   fetchData();
  // }, [plantacionId, setValue]);

  // Asignar fecha de hoy si el checkbox está marcado
  useEffect(() => {
    if (watchCheckRiego) {
      setValue('fechaRiego', new Date().toISOString().split('T')[0]);
    } else {
      setValue('fechaRiego', null);
    }
  }, [watchCheckRiego, setValue]);

  useEffect(() => {
    if (watchCheckFertilizante) {
      setValue('fechaFertilizante', new Date().toISOString().split('T')[0]);
    } else {
      setValue('fechaFertilizante', null);
    }
  }, [watchCheckFertilizante, setValue]);

  // Manejo del submit
  const onSubmit = handleSubmit(async (data) => {
    try {
      const datosParaEnviar = {};

      if (data.checkRiego) {
        datosParaEnviar.fechaRiego = data.fechaRiego;
        datosParaEnviar.tipoRiego = data.tipoRiego;
      } else {
        datosParaEnviar.fechaRiego = null;
      }

      if (data.checkFertilizante) {
        datosParaEnviar.fechaFertilizante = data.fechaFertilizante;
        datosParaEnviar.metodoAplicacionFertilizante = data.metodoAplicacionFertilizante;
        datosParaEnviar.tipoFertilizante = data.tipoFertilizante;
        datosParaEnviar.nombreFertilizante = data.nombreFertilizante;
        datosParaEnviar.cantidadFertilizante = data.cantidadFertilizante;
        datosParaEnviar.medidaFertilizante = data.medidaFertilizante;
      } else {
        datosParaEnviar.fechaFertilizante = null;
      }

      datosParaEnviar.idPlantacion = Number(plantacionId);

      await postRiegoFertilizacion(datosParaEnviar);

      if (onCreated) {
        onCreated();
      }

      // Resetear el formulario después de enviar
      reset({
        checkRiego: false,
        checkFertilizante: false,
        fechaRiego: null,
        fechaFertilizante: null,
        tipoRiego: '',
        metodoAplicacionFertilizante: '',
        tipoFertilizante: '',
        nombreFertilizante: '',
        cantidadFertilizante: '',
        medidaFertilizante: '',
      });

      // Restablecer el estado de los checkboxes
      setIsCheckboxDisabled({ riego: false, fertilizante: false });

    } catch (error) {
      console.error('Error al guardar el riego/fertilización:', error);
    }
  });

  return (
    <div className="preparacion-terreno-container">
      <h3>Agregar Riego/Fertilización</h3>
      <form className="preparacion-form" onSubmit={onSubmit}>
        {/* RIEGO */}
        <div className="form-group">
          <input
            type="checkbox"
            className="form-checkbox"
            {...register('checkRiego')}
            disabled={isCheckboxDisabled.riego}
          />
          <label className="form-label">Riego</label>
          {watchCheckRiego && (
            <span className="form-fecha">
              (Fecha: {watch('fechaRiego')})
            </span>
          )}
        </div>

        {/* Mostrar campos de riego solo si el checkbox de riego está marcado */}
        {watchCheckRiego && (
          <div className="form-group">
            <label className="form-label">Tipo de Riego:</label>
            <select
              {...register('tipoRiego', { required: true })}
              className="form-input"
            >
              <option value=""></option>
              <option value="aspersión">Aspersión</option>
              <option value="goteo">Goteo</option>
              <option value="gravedad">Gravedad</option>
            </select>
            {errors.tipoRiego && <span className="form-error"></span>}
          </div>
        )}

        {/* FERTILIZACIÓN */}
        <div className="form-group">
          <input
            type="checkbox"
            className="form-checkbox"
            {...register('checkFertilizante')}
            disabled={isCheckboxDisabled.fertilizante}
          />
          <label className="form-label">Fertilización</label>
          {watchCheckFertilizante && (
            <span className="form-fecha">
              (Fecha: {watch('fechaFertilizante')})
            </span>
          )}
        </div>

        {/* Mostrar campos de fertilización solo si el checkbox de fertilización está marcado */}
        {watchCheckFertilizante && (
          <>
            <div className="form-group">
              <label className="form-label">Método de Aplicación:</label>
              <select
                {...register('metodoAplicacionFertilizante', { required: true })}
                className="form-input"
              >
                <option value=""></option>
                <option value="al suelo">Al suelo</option>
                <option value="foliar">Foliar</option>
                <option value="fertirriego">Fertirriego</option>
              </select>
              {errors.metodoAplicacionFertilizante && <span className="form-error">Requerido</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Tipo de Fertilizante:</label>
              <select
                {...register('tipoFertilizante', { required: true })}
                className="form-input"
              >
                <option value=""></option>
                <option value="orgánico">Orgánico</option>
                <option value="químico">Químico</option>
                <option value="mixto">Mixto</option>
              </select>
              {errors.tipoFertilizante && <span className="form-error">Requerido</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Nombre del Fertilizante:</label>
              <input
                type="text"
                {...register('nombreFertilizante', { required: true })}
                className="form-input"
              />
              {errors.nombreFertilizante && <span className="form-error">Requerido</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Cantidad de Fertilizante:</label>
              <input
                type="number"
                step="any"
                {...register('cantidadFertilizante', { required: true })}
                className="form-input"
              />
              {errors.cantidadFertilizante && <span className="form-error">Requerido</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Medida del Fertilizante:</label>
              <select
                {...register('medidaFertilizante', { required: true })}
                className="form-input"
              >
                <option value=""></option>
                <option value="kg">kg</option>
                <option value="litros">litros</option>
                <option value="toneladas">toneladas</option>
              </select>
              {errors.medidaFertilizante && <span className="form-error">Requerido</span>}
            </div>
          </>
        )}

        <button className="form-button">Listo</button>
      </form>
    </div>
);
  
}