import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getSeleccionByPlantacionId, patchSeleccion } from '../api/seleccionArboles.api';
import '../styles/formulario.css';

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
  const watchVariedad = watch('seleccionVariedades');
  const watchCheckColinos = watch('checkColinos');
  const watchCheckHoyos = watch('checkHoyos');
  const watchCheckPlantacion = watch('checkPlantacion');

  // Opciones de variedades de aguacate
  const variedades = [
    { value: 'aguacate hass', label: 'Aguacate Hass' },
    { value: 'aguacate criollo', label: 'Aguacate Criollo' },
    { value: 'aguacate papelillo', label: 'Aguacate Papelillo' },
  ];

  const datosProduccion = {
    'aguacate hass': {
      primeraCosecha: '3 a 5 años',
      joven: '30 - 80 kg (3-5 años)',
      adulto: '100 - 300 kg (6-15 años)',
      viejo: '150 - 250 kg (16+ años)',
    },
    'aguacate criollo': {
      primeraCosecha: '3 a 4 años',
      joven: '20 - 50 kg (3-5 años)',
      adulto: '60 - 200 kg (6-15 años)',
      viejo: '80 - 150 kg (16+ años)',
    },
    'aguacate papelillo': {
      primeraCosecha: '4 a 6 años',
      joven: '25 - 70 kg (4-6 años)',
      adulto: '80 - 250 kg (7-15 años)',
      viejo: '100 - 200 kg (16+ años)',
    },
  };

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
            seleccion: !!seleccion.seleccionVariedades,
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

      const colinosOk = !!datosParaEnviar.preparacionColinos;
      const hoyosOk = !!datosParaEnviar.excavacionHoyos;
      const plantacionOk = !!datosParaEnviar.plantacion;
      const seleccionOk = !!datosParaEnviar.seleccionVariedades;



      if (colinosOk && hoyosOk && plantacionOk && seleccionOk ) {
        datosParaEnviar.completado = true;
      } else {
        datosParaEnviar.completado = false;
      }

      // Asegúrate de enviar el ID correcto para el PATCH
      await patchSeleccion(seleccionIdNumber, datosParaEnviar);
      window.location.reload(); // Recargar la página después de la actualización
    } catch (error) {
      console.error('Error al actualizar la selección de árboles:', error);
    }
  });

    return (
      <div className="preparacion-terreno-container">
        <h3>Agregar Selección de Árboles</h3>
        <form className="preparacion-form" onSubmit={onSubmit}>
          {/* SELECT: Selección de variedades */}
          <div className="form-group">
            <label className="form-label" htmlFor="seleccionVariedades">
              Seleccione la variedad de aguacate:
            </label>
            <select
              id="seleccionVariedades"
              className="form-input"
              {...register('seleccionVariedades')}
              required
              disabled={isCheckboxDisabled.seleccion} // Deshabilitar si ya está registrado

            >
            <option value=""></option>
              {variedades.map((variedad) => (
                <option key={variedad.value} value={variedad.value}>
                  {variedad.label}
                </option>
              ))}
            </select>
          </div>

          {/* CHECKBOX 1: Preparación de colinos */}
          <div className="form-group">
            <input
              type="checkbox"
              className="form-checkbox"
              {...register('checkColinos')}
              disabled={isCheckboxDisabled.colinos} // Deshabilitar si ya está registrado
            />
            <label className="form-label">Preparación de colinos</label>
            {watchCheckColinos && (
              <span className="form-fecha">
                (Fecha: {watch('preparacionColinos')})
              </span>
            )}
          </div>

          {/* CHECKBOX 2: Excavación de hoyos */}
          <div className="form-group">
            <input
              type="checkbox"
              className="form-checkbox"
              {...register('checkHoyos')}
              disabled={isCheckboxDisabled.hoyos} // Deshabilitar si ya está registrado
            />
            <label className="form-label">Excavación de hoyos</label>
            {watchCheckHoyos && (
              <span className="form-fecha">
                (Fecha: {watch('excavacionHoyos')})
              </span>
            )}
          </div>

          {/* CHECKBOX 3: Plantación */}
          <div className="form-group">
            <input
              type="checkbox"
              className="form-checkbox"
              {...register('checkPlantacion')}
              disabled={isCheckboxDisabled.plantacion} // Deshabilitar si ya está registrado
            />
            <label className="form-label">Fecha de plantación</label>
            {watchCheckPlantacion && (
              <span className="form-fecha">
                (Fecha: {watch('plantacion')})
              </span>
            )}

          </div>{/* Mostrar sugerencias de producción según la variedad seleccionada */}
          {watchVariedad && datosProduccion[watchVariedad] && (
          <div className="sugerencias">
            <p><strong>🌱 Primera cosecha:</strong> {datosProduccion[watchVariedad].primeraCosecha}</p>
            <p><strong>🔹 Producción estimada:</strong></p>
            <ul>
              <li><strong>Joven:</strong> {datosProduccion[watchVariedad].joven}</li>
              <li><strong>Adulto:</strong> {datosProduccion[watchVariedad].adulto}</li>
              <li><strong>Viejo:</strong> {datosProduccion[watchVariedad].viejo}</li>
            </ul>
          </div>
        )}

          <button className="form-button">Guardar</button>
        </form>
      </div>
  );
}