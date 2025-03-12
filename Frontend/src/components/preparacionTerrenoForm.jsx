import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getPreparacionByPlantacionId, patchPreparacion } from '../api/preparacionTerreno.api';
import '../styles/historial.css';
import '../styles/formulario.css';


export function PreparacionTerrenoForm({ plantacionId, preparacionId }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  // Estado para controlar si los checkboxes están deshabilitados
  const [isCheckboxDisabled, setIsCheckboxDisabled] = useState({
    limpieza: false,
    analisis: false,
    correcion: false,
    labranza: false,
    delimitacionParcela: false
  });

  const [arbolesSugeridos, setArbolesSugeridos] = useState({
    hass: [0, 0],
    criollo: [0, 0],
    papelillo: [0, 0],
  });


  // Observar checkboxes
  const watchCheckLimpieza = watch('checkLimpieza');
  const watchCheckAnalisis = watch('checkAnalisis');
  const watchCheckCorrecion = watch('checkCorrecion');
  const watchCheckLabranza = watch('checkLabranza');
  const watchDelimitacionParcela = watch('delimitacionParcela');

  // Al montar, obtenemos los datos existentes
  useEffect(() => {
    async function fetchData() {
      try {
        const plantacionIdNumber = Number(plantacionId);
        if (isNaN(plantacionIdNumber)) {
          throw new Error("plantacionId debe ser un número");
        }

        const data = await getPreparacionByPlantacionId(plantacionIdNumber);
        // Asumimos que data es un arreglo y tomamos el primer registro
        if (data && data.length > 0) {
          const preparacion = data[0];

          // Establecemos los valores en el formulario
          setValue('checkLimpieza', !!preparacion.limpiezaTerreno);
          setValue('checkAnalisis', !!preparacion.analisisSuelo);
          setValue('checkCorrecion', !!preparacion.correcionSuelo);
          setValue('checkLabranza', !!preparacion.labranza);
          setValue('delimitacionParcela', preparacion.delimitacionParcela || '');

          // Deshabilitar checkboxes si el campo ya está registrado
          setIsCheckboxDisabled({
            limpieza: !!preparacion.limpiezaTerreno,
            analisis: !!preparacion.analisisSuelo,
            correcion: !!preparacion.correcionSuelo,
            labranza: !!preparacion.labranza,
            delimitacionParcela: !!preparacion.delimitacionParcela,
          });
        }
      } catch (error) {
        console.error('Error al cargar la preparación de terreno:', error);
      }
    }
    fetchData();
  }, [plantacionId, setValue]);

  // Cada vez que cambie un checkbox, actualizamos el valor de la fecha
  useEffect(() => {
    if (watchCheckLimpieza) {
      setValue('limpiezaTerreno', new Date().toISOString().split('T')[0]);
    } else {
      setValue('limpiezaTerreno', null);
    }
  }, [watchCheckLimpieza, setValue]);

  useEffect(() => {
    if (watchCheckAnalisis) {
      setValue('analisisSuelo', new Date().toISOString().split('T')[0]);
    } else {
      setValue('analisisSuelo', null);
    }
  }, [watchCheckAnalisis, setValue]);

  useEffect(() => {
    if (watchCheckCorrecion) {
      setValue('correcionSuelo', new Date().toISOString().split('T')[0]);
    } else {
      setValue('correcionSuelo', null);
    }
  }, [watchCheckCorrecion, setValue]);

  useEffect(() => {
    if (watchCheckLabranza) {
      setValue('labranza', new Date().toISOString().split('T')[0]);
    } else {
      setValue('labranza', null);
    }
  }, [watchCheckLabranza, setValue]);

  const distanciasSiembra = {
    hass: [{ x: 6, y: 5 }, { x: 7, y: 5 }],  // 30m² o 35m² por árbol
    criollo: [{ x: 8, y: 8 }, { x: 10, y: 10 }], // 64m² o 100m² por árbol
    papelillo: [{ x: 7, y: 7 }, { x: 8, y: 6 }], // 49m² o 48m² por árbol
  };

  useEffect(() => {
    if (watchDelimitacionParcela) {
      const nuevosValores = {};
      Object.entries(distanciasSiembra).forEach(([variedad, opciones]) => {
        nuevosValores[variedad] = opciones.map((opcion) => {
          const areaPorArbol = opcion.x * opcion.y;
          return Math.floor(watchDelimitacionParcela / areaPorArbol); // Redondeamos hacia abajo
        });
      });
      setArbolesSugeridos(nuevosValores);
    } else {
      setArbolesSugeridos({ hass: [0, 0], criollo: [0, 0], papelillo: [0, 0] });
    }
  }, [watchDelimitacionParcela]);
  const onSubmit = handleSubmit(async (data) => {
    try {
      // Verifica que preparacionId sea un número
      const preparacionIdNumber = Number(preparacionId);
      if (isNaN(preparacionIdNumber)) {
        throw new Error("preparacionId debe ser un número");
      }

      // Filtrar los datos para enviar solo los campos relevantes
      const datosParaEnviar = {};

      if (data.checkLimpieza) {
        datosParaEnviar.limpiezaTerreno = data.limpiezaTerreno;
      }
      if (data.checkAnalisis) {
        datosParaEnviar.analisisSuelo = data.analisisSuelo;
      }
      if (data.checkCorrecion) {
        datosParaEnviar.correcionSuelo = data.correcionSuelo;
      }
      if (data.checkLabranza) {
        datosParaEnviar.labranza = data.labranza;
      }
      if (data.delimitacionParcela) {
        datosParaEnviar.delimitacionParcela = data.delimitacionParcela;
      }

      // ---- NUEVO: Lógica para completado ----
      // Revisamos si todos los campos están completos
      const limpiezaOk = !!datosParaEnviar.limpiezaTerreno;
      const analisisOk = !!datosParaEnviar.analisisSuelo;
      const correcionOk = !!datosParaEnviar.correcionSuelo;
      const labranzaOk = !!datosParaEnviar.labranza;
      const delimOk = !!datosParaEnviar.delimitacionParcela;

      if (limpiezaOk && analisisOk && correcionOk && labranzaOk && delimOk) {
        datosParaEnviar.completado = true;
      } else {
        datosParaEnviar.completado = false;
      }

      // Asegúrate de enviar el ID correcto para el PATCH
      await patchPreparacion(preparacionIdNumber, datosParaEnviar);

      if (data.delimitacionParcela) {
        setIsCheckboxDisabled((prevState) => ({
          ...prevState,
          delimitacionParcela: true,
        }));
      }
      window.location.reload(); // Recargar la página después de la actualización
    } catch (error) {
      console.error('Error al actualizar la preparación de terreno:', error);
    }
  });
  return (
    <div className="preparacion-terreno-container">
      <h3>Agregar Preparación de Terreno</h3>
      <form onSubmit={onSubmit} className="preparacion-form">
        {/* LIMPIEZA DEL TERRENO */}
        <div className="form-group">
          <input
            type="checkbox"
            {...register('checkLimpieza')}
            disabled={isCheckboxDisabled.limpieza}
            className="form-checkbox"
          />
          <label className="form-label">Limpieza del terreno</label>
          {watchCheckLimpieza && (
            <span className="form-fecha">(Fecha: {watch('limpiezaTerreno')})</span>
          )}
        </div>
  
        {/* ANÁLISIS DE SUELO */}
        <div className="form-group">
          <input
            type="checkbox"
            {...register('checkAnalisis')}
            disabled={isCheckboxDisabled.analisis}
            className="form-checkbox"
          />
          <label className="form-label">Análisis de suelo</label>
          {watchCheckAnalisis && (
            <span className="form-fecha">(Fecha: {watch('analisisSuelo')})</span>
          )}
        </div>
  
        {/* CORRECCIÓN DE SUELO */}
        <div className="form-group">
          <input
            type="checkbox"
            {...register('checkCorrecion')}
            disabled={isCheckboxDisabled.correcion}
            className="form-checkbox"
          />
          <label className="form-label">Corrección de suelo</label>
          {watchCheckCorrecion && (
            <span className="form-fecha">(Fecha: {watch('correcionSuelo')})</span>
          )}
        </div>
  
        {/* LABRANZA */}
        <div className="form-group">
          <input
            type="checkbox"
            {...register('checkLabranza')}
            disabled={isCheckboxDisabled.labranza}
            className="form-checkbox"
          />
          <label className="form-label">Labranza</label>
          {watchCheckLabranza && (
            <span className="form-fecha">(Fecha: {watch('labranza')})</span>
          )}
        </div>
  
        {/* DELIMITACIÓN DE PARCELA (FLOAT) */}
        <div className="form-group">
          <label className="form-label">Delimitación de parcela (m²):</label>
          <input
            type="number"
            step="any"
            {...register('delimitacionParcela', { required: false })}
            disabled={isCheckboxDisabled.delimitacionParcela}
            className="form-input"
          />
          {errors.delimitacionParcela && (
            <span className="form-error"></span>
          )}
        </div>

       {/* Sugerencia de árboles según la variedad */}
       {watchDelimitacionParcela && (
          <div className="sugerencias">
            <p className="sugerencia">
              🌱 <strong>Hass:</strong> <br />
              - En este terreno te caben aproximadamente {arbolesSugeridos.hass[0]} árboles con distancia 6 x 5 m.<br />
              - En este terreno te caben aproximadamente {arbolesSugeridos.hass[1]} árboles con distancia 7 x 5 m.
            </p>
            <p className="sugerencia">
              🌱 <strong>Criollo:</strong> <br />
              - En este terreno te caben aproximadamente {arbolesSugeridos.criollo[0]} árboles con distancia 8 x 8 m.<br />
              - En este terreno te caben aproximadamente {arbolesSugeridos.criollo[1]} árboles con distancia 10 x 10 m.
            </p>
            <p className="sugerencia">
              🌱 <strong>Papelillo:</strong> <br />
              - En este terreno te caben aproximadamente {arbolesSugeridos.papelillo[0]} árboles con distancia 7 x 7 m.<br />
              - En este terreno te caben aproximadamente {arbolesSugeridos.papelillo[1]} árboles con distancia 8 x 6 m.
            </p>
          </div>
        )}
  
        <button type="submit" className="form-button"> Guardar</button>
      </form>
    </div>
  );
}

  