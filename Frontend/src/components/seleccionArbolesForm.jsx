import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getSeleccionByPlantacionId, patchSeleccion } from '../api/seleccionArboles.api';

export function SeleccionArbolesForm({ plantacionId, seleccionId }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  // Estado para controlar si los checkboxes están deshabilitados
  const [isCheckboxDisabled, setIsCheckboxDisabled] = useState({
    colinos: false,
    hoyos: false,
    plantacion: false,
  });

  // Observar checkboxes
  const watchCheckColinos = watch('checkColinos');
  const watchCheckHoyos = watch('checkHoyos');
  const watchCheckPlantacion = watch('checkPlantacion');

  // Opciones de variedades de aguacate
  const variedades = [
    { value: 'aguacate hass', label: 'Aguacate Hass' },
    { value: 'aguacate criollo', label: 'Aguacate Criollo' },
    { value: 'aguacate papelillo', label: 'Aguacate Papelillo' },
  ];

  // Al montar, obtenemos los datos existentes
  useEffect(() => {
    async function fetchData() {
      try {
        const plantacionIdNumber = Number(plantacionId);
        if (isNaN(plantacionIdNumber)) {
          throw new Error("plantacionId debe ser un número");
        }

        const data = await getSeleccionByPlantacionId(plantacionIdNumber);
        // Asumimos que data es un arreglo y tomamos el primer registro
        if (data && data.length > 0) {
          const seleccion = data[0];

          // Establecemos los valores en el formulario
          setValue('checkColinos', !!seleccion.preparacionColinos);
          setValue('checkHoyos', !!seleccion.excavacionHoyos);
          setValue('checkPlantacion', !!seleccion.plantacion);
          setValue('seleccionVariedades', seleccion.seleccionVariedades); // Establecer la variedad seleccionada

          // Deshabilitar checkboxes si el campo ya está registrado
          setIsCheckboxDisabled({
            colinos: !!seleccion.preparacionColinos,
            hoyos: !!seleccion.excavacionHoyos,
            plantacion: !!seleccion.plantacion,
          });
        }
      } catch (error) {
        console.error('Error al cargar la selección de árboles:', error);
      }
    }
    fetchData();
  }, [plantacionId, setValue]);

  // Cada vez que cambie un checkbox, actualizamos el valor de la fecha
  useEffect(() => {
    if (watchCheckColinos) {
      setValue('preparacionColinos', new Date().toISOString().split('T')[0]);
    } else {
      setValue('preparacionColinos', null);
    }
  }, [watchCheckColinos, setValue]);

  useEffect(() => {
    if (watchCheckHoyos) {
      setValue('excavacionHoyos', new Date().toISOString().split('T')[0]);
    } else {
      setValue('excavacionHoyos', null);
    }
  }, [watchCheckHoyos, setValue]);

  useEffect(() => {
    if (watchCheckPlantacion) {
      setValue('plantacion', new Date().toISOString().split('T')[0]);
    } else {
      setValue('plantacion', null);
    }
  }, [watchCheckPlantacion, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Verifica que seleccionId sea un número
      const seleccionIdNumber = Number(seleccionId);
      if (isNaN(seleccionIdNumber)) {
        throw new Error("seleccionId debe ser un número");
      }

      // Filtrar los datos para enviar solo los campos relevantes
      const datosParaEnviar = {};

      if (data.checkColinos) {
        datosParaEnviar.preparacionColinos = data.preparacionColinos;
      }
      if (data.checkHoyos) {
        datosParaEnviar.excavacionHoyos = data.excavacionHoyos;
      }
      if (data.checkPlantacion) {
        datosParaEnviar.plantacion = data.plantacion;
      }
      if (data.seleccionVariedades) {
        datosParaEnviar.seleccionVariedades = data.seleccionVariedades;
      }

      // Asegúrate de enviar el ID correcto para el PATCH
      await patchSeleccion(seleccionIdNumber, datosParaEnviar);
      window.location.reload(); // Recargar la página después de la actualización
    } catch (error) {
      console.error('Error al actualizar la selección de árboles:', error);
    }
  });

  return (
    <div>
      <h3>Agregar Selección de Árboles</h3>
      <form onSubmit={onSubmit}>
        {/* SELECT: Selección de variedades */}
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="seleccionVariedades">Seleccione la variedad de aguacate:</label>
          <select
            id="seleccionVariedades"
            {...register('seleccionVariedades')}
            style={{ marginLeft: '8px' }}
            required
          >
            <option value="">-- Seleccione una opción --</option>
            {variedades.map((variedad) => (
              <option key={variedad.value} value={variedad.value}>
                {variedad.label}
              </option>
            ))}
          </select>
        </div>

        {/* CHECKBOX 1: Preparación de colinos */}
        <div style={{ marginBottom: '8px' }}>
          <input
            type="checkbox"
            {...register('checkColinos')}
            disabled={isCheckboxDisabled.colinos} // Deshabilitar si ya está registrado
          />
          <label style={{ marginLeft: '8px' }}>Preparación de colinos</label>
          {watchCheckColinos && (
            <span style={{ marginLeft: '16px', color: 'green' }}>
              (Fecha: {watch('preparacionColinos')})
            </span>
          )}
        </div>

        {/* CHECKBOX 2: Excavación de hoyos */}
        <div style={{ marginBottom: '8px' }}>
          <input
            type="checkbox"
            {...register('checkHoyos')}
            disabled={isCheckboxDisabled.hoyos} // Deshabilitar si ya está registrado
          />
          <label style={{ marginLeft: '8px' }}>Excavación de hoyos</label>
          {watchCheckHoyos && (
            <span style={{ marginLeft: '16px', color: 'green' }}>
              (Fecha: {watch('excavacionHoyos')})
            </span>
          )}
        </div>

        {/* CHECKBOX 3: Plantación */}
        <div style={{ marginBottom: '8px' }}>
          <input
            type="checkbox"
            {...register('checkPlantacion')}
            disabled={isCheckboxDisabled.plantacion} // Deshabilitar si ya está registrado
          />
          <label style={{ marginLeft: '8px' }}>Fecha de plantación</label>
          {watchCheckPlantacion && (
            <span style={{ marginLeft: '16px', color: 'green' }}>
              (Fecha: {watch('plantacion')})
            </span>
          )}
        </div>

        <button style={{ marginTop: '16px' }}>Listo</button>
      </form>
    </div>
  );
}