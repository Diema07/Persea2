import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { postPoda } from '../api/poda.api';

export function PodaForm({ plantacionId, onCreated }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();


  // Cargar datos existentes al montar el componente
  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const plantacionIdNumber = Number(plantacionId);
  //       if (isNaN(plantacionIdNumber)) {
  //         throw new Error("plantacionId debe ser un número");
  //       }
  //       const data = await getPodaByPlantacionId(plantacionIdNumber);

  //       if (data && data.length > 0) {
  //         const Poda = data[0];

  //         setValue('checkFechaPoda', !!Poda.fechaPoda);

  //         setIsCheckboxDisabled({
  //           Poda: !!Poda.fechaPoda,
  //         });

  //         setValue('tipoPoda', Poda.tipoPoda || '');
  //         setValue('herramientasUsadas', Poda.herramientasUsadas || '');
  //         setValue('tecnicasUsadas', Poda.tecnicasUsadas || '');
  //       }
  //     } catch (error) {
  //       console.error('Error al cargar Poda:', error);
  //     }
  //   }
  //   fetchData();
  // }, [plantacionId, setValue]);

  // Manejo del submit
  const onSubmit = handleSubmit(async (data) => {
    try {
      const datosParaEnviar = {};

      if (data.tipoPoda) {
        datosParaEnviar.tipoPoda = data.tipoPoda;
      }

      if (data.herramientasUsadas) {
        datosParaEnviar.herramientasUsadas = data.herramientasUsadas;
      }

      if (data.tecnicasUsadas) {
        datosParaEnviar.tecnicasUsadas = data.tecnicasUsadas;
      }

      datosParaEnviar.idPlantacion = Number(plantacionId);
      console.log("Datos a enviar:", datosParaEnviar);

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
    <div className="preparacion-terreno-container">
      <h3>Agregar Poda</h3>
      <form className="preparacion-form" onSubmit={onSubmit}>
        {/* Tipo de Poda */}
        <div className="form-group">
          <label className="form-label">Tipo de Poda:</label>
          <select
            className="form-input"
            {...register('tipoPoda', { required: true })}
          >
            <option value=""></option>
            <option value="formacion">Formación</option>
            <option value="mantenimiento">Mantenimiento</option>
            <option value="sanitaria">Sanitaria</option>
          </select>
          {errors.tipoPoda && <span className="form-error">Requerido</span>}
        </div>

        {/* Herramientas Usadas */}
        <div className="form-group">
          <label className="form-label">Herramientas Usadas:</label>
          <select
            className="form-input"
            {...register('herramientasUsadas', { required: true })}
          >
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
          <select
            className="form-input"
            {...register('tecnicasUsadas', { required: true })}
          >
            <option value=""></option>
            <option value="ralo">Raleo</option>
            <option value="deschuponado">Deschuponado</option>
            <option value="rebaje">Rebaje</option>
          </select>
          {errors.tecnicasUsadas && <span className="form-error">Requerido</span>}
        </div>

        <button className="form-button">Guardar</button>
      </form>
    </div>
  );
}
