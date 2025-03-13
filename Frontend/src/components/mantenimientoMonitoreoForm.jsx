import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { postMantenimientoMonitoreo } from '../api/mantenimientoMonitoreo.api';

export function MantenimientoMonitoreoForm({ plantacionId, onCreated }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  // Estado para controlar qué checkbox está seleccionado
  const [selectedOption, setSelectedOption] = useState(null);

  // Observar checkboxes
  const watchCheckGuadana = watch('checkGuadana');
  const watchCheckAplicacion = watch('checkAplicacion');

  // Efecto para manejar la selección de un solo checkbox
  useEffect(() => {
    if (watchCheckGuadana) {
      setSelectedOption('guadana');
      setValue('checkAplicacion', false); // Desmarcar el otro checkbox
    } else if (watchCheckAplicacion) {
      setSelectedOption('fumigacion');
      setValue('checkGuadana', false); // Desmarcar el otro checkbox
    } else {
      setSelectedOption(null);
    }
  }, [watchCheckGuadana, watchCheckAplicacion, setValue]);

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

    if (!data.checkGuadana && !data.checkAplicacion) {
      alert("Debe seleccionar una opción: Guadaña o Fumigación.");
      return;
    }

    try {
      const datosParaEnviar = {
        idPlantacion: Number(plantacionId),
      };

      if (data.checkGuadana) {
        datosParaEnviar.guadana = data.guadana;
        // Limpiar campos de fumigación
        datosParaEnviar.fechaAplicacionTratamiento = null;
        datosParaEnviar.metodoAplicacionFumigacion = null;
        datosParaEnviar.tipoTratamiento = null;
        datosParaEnviar.nombreTratamiento = null;
        datosParaEnviar.cantidadTratamiento = null;
        datosParaEnviar.medidaTratamiento = null;
      } else if (data.checkAplicacion) {
        datosParaEnviar.fechaAplicacionTratamiento = data.fechaAplicacionTratamiento;
        datosParaEnviar.metodoAplicacionFumigacion = data.metodoAplicacionFumigacion;
        datosParaEnviar.tipoTratamiento = data.tipoTratamiento;
        datosParaEnviar.nombreTratamiento = data.nombreTratamiento;
        datosParaEnviar.cantidadTratamiento = data.cantidadTratamiento;
        datosParaEnviar.medidaTratamiento = data.medidaTratamiento;
        // Limpiar campo de guadaña
        datosParaEnviar.guadana = null;
      }

      console.log(data)

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
        metodoAplicacionFumigacion: '',
        tipoTratamiento: '',
        nombreTratamiento: '',
        cantidadTratamiento: '',
        medidaTratamiento: '',
      });

      // Restablecer el estado de selección
      setSelectedOption(null);
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
            disabled={selectedOption === 'fumigacion'}
          />
          <label className="form-label">Guadaña</label>
          {watchCheckGuadana && (
            <span className="form-fecha">
              (Fecha: {watch('guadana')})
            </span>
          )}
        </div>

         {/* Sugerencias para Guadañada */}
         {watchCheckGuadana && (
          <div className="sugerencias">
            <h4>🌾 Programa de Guadañada Sugerido</h4>
            <p><strong>Árboles jóvenes (1-3 años):</strong></p>
            <ul>
              <li><strong>Primavera-Verano:</strong> Cada 4-6 semanas (Las malezas crecen más rápido).</li>
              <li><strong>Otoño-Invierno:</strong> Cada 6-8 semanas (Reducir en climas fríos).</li>
            </ul>
            <p><strong>Árboles en producción (4+ años):</strong></p>
            <ul>
              <li><strong>Primavera-Verano:</strong> Cada 6-8 semanas (Mantener área libre de malezas).</li>
              <li><strong>Otoño-Invierno:</strong> Cada 8-10 semanas (Reducir si las malezas crecen más lento).</li>
            </ul>
          </div>
        )}

        {/* FUMIGACIÓN */}
        <div className="form-group">
          <input
            type="checkbox"
            className="form-checkbox"
            {...register('checkAplicacion')}
            disabled={selectedOption === 'guadana'}
          />
          <label className="form-label">Fumigación</label>
          {watchCheckAplicacion && (
            <span className="form-fecha">
              (Fecha: {watch('fechaAplicacionTratamiento')})
            </span>
          )}
        </div>

        {/* Mostrar campos de fumigación solo si el checkbox está marcado */}
        {watchCheckAplicacion && (
          <>
            <div className="form-group">
              <label className="form-label">Método de Aplicación:</label>
              <select
                {...register('metodoAplicacionFumigacion', { required: true })}
                className="form-input"
              >
                <option value=""></option>
                <option value="al suelo">Al suelo</option>
                <option value="foliar">Foliar</option>
              </select>
              {errors.metodoAplicacionFumigacion && (
                <span className="form-error">Requerido</span>
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
                <span className="form-error">Requerido</span>
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
                <span className="form-error">Requerido</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Cantidad Tratamiento:</label>
              <input
                type="number"
                {...register('cantidadTratamiento', { required: true })}
                className="form-input"
              />
              {errors.cantidadTratamiento && (
                <span className="form-error">Requerido</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Medida Tratamiento:</label>
              <select
                {...register('medidaTratamiento', { required: true })}
                className="form-input"
              >
                <option value=""></option>
                <option value="kg">kg</option>
                <option value="gr">gr</option>
                <option value="ml">ml</option>
                <option value="litros">litros</option>
              </select>
              {errors.medidaTratamiento && (
                <span className="form-error">Requerido</span>
              )}
            </div>
          </>
        )}

        {/* Sugerencias para Fumigación */}
        {watchCheckAplicacion && (
          <div className="sugerencias">
            <h4>🦠 Programa de Fumigación Sugerido</h4>
            <h5>Preventivo:</h5>
            <ul>
              <li><strong>Inicio de primavera:</strong> Cada 2-3 meses (Fungicida preventivo).</li>
              <li><strong>Inicio de verano:</strong> Cada 2-3 meses (Insecticida preventivo).</li>
            </ul>
            <h5>Correctivo:</h5>
            <ul>
              <li><strong>Detección de plagas:</strong> Aplicar insecticida específico de inmediato.</li>
              <li><strong>Detección de enfermedades:</strong> Aplicar fungicida específico de inmediato.</li>
            </ul>
          </div>
        )}


        <button type="submit" className="form-button">Guardar</button>
      </form>
    </div>
  );
}