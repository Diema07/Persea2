import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    delimitacionParcela: false,
  });

  const [arbolesSugeridos, setArbolesSugeridos] = useState({
    hass: [0, 0],
    criollo: [0, 0],
    papelillo: [0, 0],
  });

  const navigate = useNavigate();

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
          throw new Error('plantacionId debe ser un número');
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

  // Actualizar fechas cuando los checkboxes cambian
  useEffect(() => {
    const fechaActual = new Date().toISOString().split('T')[0];
    if (watchCheckLimpieza) setValue('limpiezaTerreno', fechaActual);
    else setValue('limpiezaTerreno', null);
  }, [watchCheckLimpieza, setValue]);

  useEffect(() => {
    const fechaActual = new Date().toISOString().split('T')[0];
    if (watchCheckAnalisis) setValue('analisisSuelo', fechaActual);
    else setValue('analisisSuelo', null);
  }, [watchCheckAnalisis, setValue]);

  useEffect(() => {
    const fechaActual = new Date().toISOString().split('T')[0];
    if (watchCheckCorrecion) setValue('correcionSuelo', fechaActual);
    else setValue('correcionSuelo', null);
  }, [watchCheckCorrecion, setValue]);

  useEffect(() => {
    const fechaActual = new Date().toISOString().split('T')[0];
    if (watchCheckLabranza) setValue('labranza', fechaActual);
    else setValue('labranza', null);
  }, [watchCheckLabranza, setValue]);

  // Distancias de siembra
  const distanciasSiembra = {
    hass: [
      { distancia: '6m x 5m', area: 30 },
      { distancia: '7m x 5m', area: 35 },
    ],
    criollo: [
      { distancia: '8m x 8m', area: 64 },
      { distancia: '10m x 10m', area: 100 },
    ],
    papelillo: [
      { distancia: '7m x 7m', area: 49 },
      { distancia: '8m x 6m', area: 48 },
    ],
  };

  // Calcular árboles sugeridos cuando cambia la delimitación de parcela
  useEffect(() => {
    if (watchDelimitacionParcela) {
      const nuevosValores = {};
      Object.entries(distanciasSiembra).forEach(([variedad, opciones]) => {
        nuevosValores[variedad] = opciones.map((opcion) => {
          return Math.floor(watchDelimitacionParcela / opcion.area);
        });
      });
      setArbolesSugeridos(nuevosValores);
    } else {
      setArbolesSugeridos({ hass: [0, 0], criollo: [0, 0], papelillo: [0, 0] });
    }
  }, [watchDelimitacionParcela, distanciasSiembra]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Verifica que preparacionId sea un número
      const preparacionIdNumber = Number(preparacionId);
      if (isNaN(preparacionIdNumber)) {
        throw new Error('preparacionId debe ser un número');
      }

      // Filtrar los datos para enviar solo los campos relevantes
      const datosParaEnviar = {};

      if (data.checkLimpieza) datosParaEnviar.limpiezaTerreno = data.limpiezaTerreno;
      if (data.checkAnalisis) datosParaEnviar.analisisSuelo = data.analisisSuelo;
      if (data.checkCorrecion) datosParaEnviar.correcionSuelo = data.correcionSuelo;
      if (data.checkLabranza) datosParaEnviar.labranza = data.labranza;
      if (data.delimitacionParcela) datosParaEnviar.delimitacionParcela = data.delimitacionParcela;

      // Revisamos si todos los campos están completos
      const limpiezaOk = !!datosParaEnviar.limpiezaTerreno;
      const analisisOk = !!datosParaEnviar.analisisSuelo;
      const correcionOk = !!datosParaEnviar.correcionSuelo;
      const labranzaOk = !!datosParaEnviar.labranza;
      const delimOk = !!datosParaEnviar.delimitacionParcela;

      datosParaEnviar.completado = limpiezaOk && analisisOk && correcionOk && labranzaOk && delimOk;

      // Asegúrate de enviar el ID correcto para el PATCH
      await patchPreparacion(preparacionIdNumber, datosParaEnviar);

      if (data.delimitacionParcela) {
        setIsCheckboxDisabled((prevState) => ({
          ...prevState,
          delimitacionParcela: true,
        }));
      }

      navigate(`/gestionTareas/${plantacionId}`);
    } catch (error) {
      console.error('Error al actualizar la preparación de terreno:', error);
    }
  });

  return (
    <div className="contenedor-principal">
      {/* Formulario */}
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
            {errors.delimitacionParcela && <span className="form-error"></span>}
          </div>
  
          <button type="submit" className="form-button">
            Guardar
          </button>
        </form>
      </div>
  
      {/* Sugerencias */}
      {watchDelimitacionParcela && (
        <div className="sugerencias">
          <h4>🌱 Sugerencias de siembra:</h4>
          {Object.entries(arbolesSugeridos).map(([variedad, valores], index) => (
            <p key={index} className="sugerencia">
              <strong>{variedad.charAt(0).toUpperCase() + variedad.slice(1)}:</strong> <br />
              - {valores[0]} árboles con distancia {distanciasSiembra[variedad][0].distancia}.<br />
              - {valores[1]} árboles con distancia {distanciasSiembra[variedad][1].distancia}.
            </p>
          ))}
        </div>
      )}
    </div>
  );
}