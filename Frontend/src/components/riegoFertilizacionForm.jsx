import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {postRiegoFertilizacion,} from '../api/riegoFertilizacion.api';
import '../styles/formulario.css';
import advertencia from '../img/advertencia.png'

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
  const [IsModalOpenAdvertencia, setIsModalOpenAdvertencia] = useState(false); 

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
      setValue('fechaFertilizante', new Date().toISOString().split('T')[0])
    } else {
      setValue('fechaFertilizante', null);
    }
  }, [watchCheckFertilizante, setValue]);




  // Manejo del submit
  const onSubmit = handleSubmit(async (data) => {

    if (!data.checkRiego && !data.checkFertilizante) {
      setIsModalOpenAdvertencia(true);
      return;
    }

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
<>
    <div className='contenedor-principal'>
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

              <div className="form-group-inline">
                <div className="form-group">
                  <label className="form-label">Cantidad de Fertilizante:</label>
                  <input
                    type="number"
                    step="any"
                    {...register('cantidadFertilizante', { required: true })}
                    className="form-input"
                  />
                  {errors.cantidadFertilizante && <span className="form-error">Requerido</span>}
                

                <div className="form-group">
                  <label className="form-label"></label>
                  <select
                    {...register('medidaFertilizante', { required: true })}
                    className="form-input-ancho"
                  >
                    <option value="kg">kg</option>
                    <option value="gr">gr</option>
                    <option value="litros">litros</option>
                    <option value="ml">ml</option>
                  </select>
                  {errors.medidaFertilizante && <span className="form-error">Requerido</span>}
                </div>
                </div>
              </div> 
            </>
          )}
            <button className="form-button">Guardar</button>
            </form>
        </div>
            {/* Sugerencias para Riego */}
            {watchCheckRiego && (
            <div className="sugerencias">
              <h4><strong>🌊 Programa de Riego Sugerido</strong></h4>
              <p><strong>Árboles jóvenes (1-3 años):</strong></p>
              <ul>
                <li><strong>Verano:</strong> Cada 7-10 días (Aumenta en climas cálidos).</li>
                <li><strong>Invierno:</strong> Cada 10-15 días (Reduce en climas fríos o lluviosos).</li>
              </ul>
              <p><strong>Árboles en producción (4+ años):</strong></p>
              <ul>
                <li><strong>Floración:</strong> Cada 7-10 días (Mantener suelo húmedo).</li>
                <li><strong>Cuajado de frutos:</strong> Cada 7-10 días (Suministro constante).</li>
                <li><strong>Post-cosecha:</strong> Cada 10-15 días (Reducir gradualmente).</li>
              </ul>
            </div>
          )}


          {/* Sugerencias para Fertilización */}
          {watchCheckFertilizante && (
            <div className="sugerencias">
              <h4><strong>🌿 Recomendaciones de Fertilización</strong></h4>
              <p><strong>Árboles jóvenes (1-3 años):</strong></p>
              <ul>
                <li><strong>Frecuencia:</strong> Cada 2-3 meses.</li>
                <li><strong>Objetivo:</strong> Promover crecimiento vegetativo.</li>
                <li><strong>Recomendación:</strong> Fertilizantes ricos en N, P y K en proporción equilibrada.</li>
              </ul>
              <p><strong>Árboles en producción (4+ años):</strong></p>
              <ul>
                <li><strong>Frecuencia:</strong> 3-4 veces al año.</li>
                <li><strong>Objetivo:</strong> Mantener equilibrio nutricional.</li>
              </ul>
              <h5>Etapas clave:</h5>
              <ul>
                <li><strong>Antes de la floración:</strong> Fertilizantes ricos en P y K.</li>
                <li><strong>Durante el desarrollo de frutos:</strong> Aumentar potasio (K).</li>
                <li><strong>Después de la cosecha:</strong> Aplicar nitrógeno (N).</li>
              </ul>
            </div>
          )}
          {/* 📌 Sugerencias dinámicas según la variedad */}
      
        
    </div>
   
     {IsModalOpenAdvertencia &&  (
          <div className="modal-overlay-2">
              <div className="modal-2">
                  <img src={advertencia} alt="Advertencia" className='img-advertencia' />
                  <p>Debe seleccionar una opción: <strong> Riego o Fertilización.</strong></p>

                  <button className="confirmar" onClick={() => setIsModalOpenAdvertencia(false)}>Entiendo</button>
                  
              </div>
          </div>
      )}
    </>
);
}