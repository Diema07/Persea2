import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  getRiegoByPlantacionId,
  postRiegoFertilizacion,
} from '../api/riegoFertilizacion.api';
import '../styles/formulario.css';

export function RiegoFertilizacionForm({ plantacionId,  onCreated }) {
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
    riego: false,
    fertilizante: false,
  });

  // Observar checkboxes
  const watchCheckRiego = watch('checkRiego');
  const watchCheckFertilizante = watch('checkFertilizante');

  // Al montar, obtenemos si ya existe un registro (opcional)
  useEffect(() => {
    async function fetchData() {
      try {
        const plantacionIdNumber = Number(plantacionId);
        if (isNaN(plantacionIdNumber)) {
          throw new Error("plantacionId debe ser un número");
        }

        const data = await getRiegoByPlantacionId(plantacionIdNumber);

        // Si hay un registro existente, puedes usarlo para deshabilitar checkboxes
        // o mostrar un mensaje. Opcional:
        if (data && data.length > 0) {
          const riegoFertilizacion = data[0];

          // Asignar checkboxes si ya tienen fecha
          setValue('checkRiego', !!riegoFertilizacion.fechaRiego);
          setValue('checkFertilizante', !!riegoFertilizacion.fechaFertilizante);

          setIsCheckboxDisabled({
            riego: !!riegoFertilizacion.fechaRiego,
            fertilizante: !!riegoFertilizacion.fechaFertilizante,
          });

          // Prellenar campos de texto si quieres
          setValue('tipoRiego', riegoFertilizacion.tipoRiego || '');
          setValue('metodoAplicacionFertilizante', riegoFertilizacion.metodoAplicacionFertilizante || '');
          setValue('tipoFertilizante', riegoFertilizacion.tipoFertilizante || '');
          setValue('nombreFertilizante', riegoFertilizacion.nombreFertilizante || '');
          setValue('cantidadFertilizante', riegoFertilizacion.cantidadFertilizante || '');
          setValue('medidaFertilizante', riegoFertilizacion.medidaFertilizante || '');
        }
      } catch (error) {
        console.error('Error al cargar el riego/fertilización:', error);
      }
    }
    fetchData();
  }, [plantacionId, setValue]);

  // Cada vez que cambie un checkbox, asignamos fecha de hoy o null
  useEffect(() => {
    if (watchCheckRiego) {
      setValue('fechaRiego', new Date().toISOString().split('T')[0]);
    } else {
      setValue('fechaRiego', null); // Asignar null si no está marcado
    }
  }, [watchCheckRiego, setValue]);

  useEffect(() => {
    if (watchCheckFertilizante) {
      setValue('fechaFertilizante', new Date().toISOString().split('T')[0]);
    } else {
      setValue('fechaFertilizante', null); // Asignar null si no está marcado
    }
  }, [watchCheckFertilizante, setValue]);

  // Manejo del submit: CREAR (POST) o ACTUALIZAR (PATCH) un registro
  const onSubmit = handleSubmit(async (data) => {
    try {
      const datosParaEnviar = {};

      // Solo incluir campos si el checkbox está marcado
      if (data.checkRiego) {
        datosParaEnviar.fechaRiego = data.fechaRiego;
      } else {
        datosParaEnviar.fechaRiego = null; // Enviar null si no está marcado
      }

      if (data.checkFertilizante) {
        datosParaEnviar.fechaFertilizante = data.fechaFertilizante;
      } else {
        datosParaEnviar.fechaFertilizante = null; // Enviar null si no está marcado
      }

      // Incluir otros campos
      if (data.tipoRiego) {
        datosParaEnviar.tipoRiego = data.tipoRiego;
      }
      if (data.metodoAplicacionFertilizante) {
        datosParaEnviar.metodoAplicacionFertilizante = data.metodoAplicacionFertilizante;
      }
      if (data.tipoFertilizante) {
        datosParaEnviar.tipoFertilizante = data.tipoFertilizante;
      }
      if (data.nombreFertilizante) {
        datosParaEnviar.nombreFertilizante = data.nombreFertilizante;
      }
      if (data.cantidadFertilizante) {
        datosParaEnviar.cantidadFertilizante = data.cantidadFertilizante;
      }
      if (data.medidaFertilizante) {
        datosParaEnviar.medidaFertilizante = data.medidaFertilizante;
      }

      // Asignar la plantación a la que pertenece
      datosParaEnviar.idPlantacion = Number(plantacionId);

        // Si no hay un riegoId, creamos un nuevo registro (POST)
      await postRiegoFertilizacion(datosParaEnviar);
      

      // Recargar la página o ejecutar una función de callback
      if (onCreated) {
        onCreated();
      }

      reset();
      
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
          />
          <label className="form-label">Riego</label>
          {watchCheckRiego && (
            <span className="form-fecha">
              (Fecha: {watch('fechaRiego')})
            </span>
          )}
        </div>

        {/* TIPO DE RIEGO */}
        <div className="form-group">
          <label className="form-label">Tipo de Riego:</label>
          <select
            className="form-input"
            {...register('tipoRiego', { required: false })}
          >
            <option value=""></option>
            <option value="aspersión">Aspersión</option>
            <option value="goteo">Goteo</option>
            <option value="gravedad">Gravedad</option>
          </select>
          {errors.tipoRiego && <span className="form-error"></span>}
        </div>

        {/* FERTILIZACIÓN */}
        <div className="form-group">
          <input
            type="checkbox"
            className="form-checkbox"
            {...register('checkFertilizante')}
          />
          <label className="form-label">Fertilización</label>
          {watchCheckFertilizante && (
            <span className="form-fecha">
              (Fecha: {watch('fechaFertilizante')})
            </span>
          )}
        </div>

        {/* MÉTODO DE APLICACIÓN DE FERTILIZANTE */}
        <div className="form-group">
          <label className="form-label">Método de Aplicación:</label>
          <select
            className="form-input"
            {...register('metodoAplicacionFertilizante', { required: false })}
          >
            <option value=""></option>
            <option value="al suelo">Al suelo</option>
            <option value="foliar">Foliar</option>
            <option value="fertirriego">Fertirriego</option>
          </select>
          {errors.metodoAplicacionFertilizante && <span className="form-error"></span>}
        </div>

        {/* TIPO DE FERTILIZANTE */}
        <div className="form-group">
          <label className="form-label">Tipo de Fertilizante:</label>
          <select
            className="form-input"
            {...register('tipoFertilizante', { required: false })}
          >
            <option value=""></option>
            <option value="orgánico">Orgánico</option>
            <option value="químico">Químico</option>
            <option value="mixto">Mixto</option>
          </select>
          {errors.tipoFertilizante && <span className="form-error"></span>}
        </div>

        {/* NOMBRE DEL FERTILIZANTE */}
        <div className="form-group">
          <label className="form-label">Nombre del Fertilizante:</label>
          <input
            type="text"
            className="form-input"
            {...register('nombreFertilizante', { required: false })}
          />
          {errors.nombreFertilizante && <span className="form-error"></span>}
        </div>

        {/* CANTIDAD DE FERTILIZANTE */}
        <div className="form-group">
          <label className="form-label">Cantidad de Fertilizante:</label>
          <input
            type="number"
            step="any"
            className="form-input"
            {...register('cantidadFertilizante', { required: false })}
          />
          {errors.cantidadFertilizante && <span className="form-error"></span>}
        </div>

        {/* MEDIDA DEL FERTILIZANTE */}
        <div className="form-group">
          <label className="form-label">Medida del Fertilizante:</label>
          <select
            className="form-input"
            {...register('medidaFertilizante', { required: false })}
          >
            <option value=""></option>
            <option value="kg">kg</option>
            <option value="litros">litros</option>
            <option value="toneladas">toneladas</option>
          </select>
          {errors.medidaFertilizante && <span className="form-error"></span>}
        </div>

        <button className="form-button">Listo</button>
      </form>
    </div>
);
  // return (
  //   <div>
  //     <h3>Agregar Riego/Fertilización</h3>
  //     <form onSubmit={onSubmit}>
  //       {/* RIEGO */}
  //       <div style={{ marginBottom: '8px' }}>
  //         <input
  //           type="checkbox"
  //           {...register('checkRiego')}
  //         />
  //         <label style={{ marginLeft: '8px' }}>Riego</label>
  //         {watchCheckRiego && (
  //           <span style={{ marginLeft: '16px', color: 'green' }}>
  //             (Fecha: {watch('fechaRiego')})
  //           </span>
  //         )}
  //       </div>

  //       {/* TIPO DE RIEGO */}
  //       <div style={{ marginBottom: '8px' }}>
  //         <label>Tipo de Riego:</label>
  //         <select
  //           {...register('tipoRiego', { required: false })}
  //           style={{ marginLeft: '8px' }}
  //         >
  //           <option value="">-- Seleccione una opción --</option>
  //           <option value="aspersión">Aspersión</option>
  //           <option value="goteo">Goteo</option>
  //           <option value="gravedad">Gravedad</option>
  //         </select>
  //         {errors.tipoRiego && <span style={{ color: 'red' }}></span>}
  //       </div>

  //       {/* FERTILIZACIÓN */}
  //       <div style={{ marginBottom: '8px' }}>
  //         <input
  //           type="checkbox"
  //           {...register('checkFertilizante')}
  //         />
  //         <label style={{ marginLeft: '8px' }}>Fertilización</label>
  //         {watchCheckFertilizante && (
  //           <span style={{ marginLeft: '16px', color: 'green' }}>
  //             (Fecha: {watch('fechaFertilizante')})
  //           </span>
  //         )}
  //       </div>


  //       {/* MÉTODO DE APLICACIÓN DE FERTILIZANTE */}
  //       <div style={{ marginBottom: '8px' }}>
  //         <label>Método de Aplicación:</label>
  //         <select
  //           {...register('metodoAplicacionFertilizante', { required: false })}
  //           style={{ marginLeft: '8px' }}
  //         >
  //           <option value="">-- Seleccione una opción --</option>
  //           <option value="al suelo">Al suelo</option>
  //           <option value="foliar">Foliar</option>
  //           <option value="fertirriego">Fertirriego</option>
  //         </select>
  //         {errors.metodoAplicacionFertilizante && <span style={{ color: 'red' }}></span>}
  //       </div>

  //       {/* TIPO DE FERTILIZANTE */}
  //       <div style={{ marginBottom: '8px' }}>
  //         <label>Tipo de Fertilizante:</label>
  //         <select
  //           {...register('tipoFertilizante', { required: false })}
  //           style={{ marginLeft: '8px' }}
  //         >
  //           <option value="">-- Seleccione una opción --</option>
  //           <option value="orgánico">Orgánico</option>
  //           <option value="químico">Químico</option>
  //           <option value="mixto">Mixto</option>
  //         </select>
  //         {errors.tipoFertilizante && <span style={{ color: 'red' }}></span>}
  //       </div>

  //       {/* NOMBRE DEL FERTILIZANTE */}
  //       <div style={{ marginBottom: '8px' }}>
  //         <label>Nombre del Fertilizante:</label>
  //         <input
  //           type="text"
  //           {...register('nombreFertilizante', { required: false })}
  //           style={{ marginLeft: '8px' }}
  //         />
  //         {errors.nombreFertilizante && <span style={{ color: 'red' }}></span>}
  //       </div>

  //       {/* CANTIDAD DE FERTILIZANTE */}
  //       <div style={{ marginBottom: '8px' }}>
  //         <label>Cantidad de Fertilizante:</label>
  //         <input
  //           type="number"
  //           step="any"
  //           {...register('cantidadFertilizante', { required: false })}
  //           style={{ marginLeft: '8px' }}
  //         />
  //         {errors.cantidadFertilizante && <span style={{ color: 'red' }}></span>}
  //       </div>

  //       {/* MEDIDA DEL FERTILIZANTE */}
  //       <div style={{ marginBottom: '8px' }}>
  //         <label>Medida del Fertilizante:</label>
  //         <select
  //           {...register('medidaFertilizante', { required: false })}
  //           style={{ marginLeft: '8px' }}
  //         >
  //           <option value="">-- Seleccione una opción --</option>
  //           <option value="kg">kg</option>
  //           <option value="litros">litros</option>
  //           <option value="toneladas">toneladas</option>
  //         </select>
  //         {errors.medidaFertilizante && <span style={{ color: 'red' }}></span>}
  //       </div>

  //       <button style={{ marginTop: '16px' }}>Listo</button>
  //     </form>
  //   </div>
  // );
}