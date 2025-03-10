import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getPodaByPlantacionId, postPoda } from '../api/poda.api';

export function PodaForm({ plantacionId, onCreated }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const [isCheckboxDisabled, setIsCheckboxDisabled] = useState({
    fechaPoda: false,
  });

  const watchCheckFechaPoda = watch('checkFechaPoda');

  // Cargar datos existentes al montar el componente
  useEffect(() => {
    async function fetchData() {
      try {
        const plantacionIdNumber = Number(plantacionId);
        if (isNaN(plantacionIdNumber)) {
          throw new Error("plantacionId debe ser un número");
        }
        const data = await getPodaByPlantacionId(plantacionIdNumber);

        if (data && data.length > 0) {
          const Poda = data[0];

          setValue('checkFechaPoda', !!Poda.fechaPoda);

          setIsCheckboxDisabled({
            Poda: !!Poda.fechaPoda,
          });

          setValue('tipoPoda', Poda.tipoPoda || '');
          setValue('herramientasUsadas', Poda.herramientasUsadas || '');
          setValue('tecnicasUsadas', Poda.tecnicasUsadas || '');
        }
      } catch (error) {
        console.error('Error al cargar Poda:', error);
      }
    }
    fetchData();
  }, [plantacionId, setValue]);

  // Asignar fecha de hoy si el checkbox está marcado
  useEffect(() => {
    if (watchCheckFechaPoda) {
      setValue('fechaPoda', new Date().toISOString().split('T')[0]);
    } else {
      setValue('fechaPoda', null);
    }
  }, [watchCheckFechaPoda, setValue]);

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

      if (data.fechaPoda) {
        datosParaEnviar.fechaPoda = data.fechaPoda;
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
    <div>
      <h3>Agregar Poda</h3>
      <form onSubmit={onSubmit}>
        {/* Fecha de Poda */}
        <div style={{ marginBottom: '8px' }}>
          <input
            type="checkbox"
            {...register('checkFechaPoda', { required: "Este campo es obligatorio" })}
          />
          <label style={{ marginLeft: '8px' }}>Fecha de Poda</label>
          {watchCheckFechaPoda && (
            <span style={{ marginLeft: '16px', color: 'green' }}>
              (Fecha: {watch('fechaPoda')})
            </span>
          )}
          {errors.checkFechaPoda && (
            <span style={{ color: 'red', marginLeft: '8px' }}>
              {errors.checkFechaPoda.message}
            </span>
          )}
        </div>

        {/* Tipo de Poda */}
        <div style={{ marginBottom: '8px' }}>
          <label>Tipo de Poda:</label>
          <select
            {...register('tipoPoda', { required: true })}
            style={{ marginLeft: '8px' }}
          >
            <option value=""></option>
            <option value="formacion">Formación</option>
            <option value="mantenimiento">Mantenimiento</option>
            <option value="sanitaria">Sanitaria</option>
          </select>
          {errors.tipoPoda && (
            <span style={{ color: 'red', marginLeft: '8px' }}>Requerido</span>
          )}
        </div>

        {/* Herramientas Usadas */}
        <div style={{ marginBottom: '8px' }}>
          <label>Herramientas Usadas:</label>
          <select
            {...register('herramientasUsadas', { required: true })}
            style={{ marginLeft: '8px' }}
          >
            <option value=""></option>
            <option value="tijeras">Tijeras</option>
            <option value="serrucho">Serrucho</option>
            <option value="motosierra">Motosierra</option>
          </select>
          {errors.herramientasUsadas && (
            <span style={{ color: 'red', marginLeft: '8px' }}>Requerido</span>
          )}
        </div>

        {/* Técnicas Usadas */}
        <div style={{ marginBottom: '8px' }}>
          <label>Técnicas Usadas:</label>
          <select
            {...register('tecnicasUsadas', { required: true })}
            style={{ marginLeft: '8px' }}
          >
            <option value=""></option>
            <option value="ralo">Raleo</option>
            <option value="deschuponado">Deschuponado</option>
            <option value="rebaje">Rebaje</option>
          </select>
          {errors.tecnicasUsadas && (
            <span style={{ color: 'red', marginLeft: '8px' }}>Requerido</span>
          )}
        </div>

        <button style={{ marginTop: '16px' }}>Guardar</button>
      </form>
    </div>
  );
}