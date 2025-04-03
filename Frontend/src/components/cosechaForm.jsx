import React, { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import advertencia from '../img/advertencia.png';
import { postCosecha, completarPlantacion, getCosechaByPlantacionId } from '../api/cosecha.api';
import { useNavigate } from 'react-router-dom';

export function CosechaForm({ plantacionId, variedad, onCreated }) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();

  const [cantidadTotal, setCantidadTotal] = useState(0);
  const watchCantidadAltaCalidad = useWatch({ control, name: 'cantidadAltaCalidad' });
  const watchCantidadMedianaCalidad = useWatch({ control, name: 'cantidadMedianaCalidad' });
  const watchCantidadBajaCalidad = useWatch({ control, name: 'cantidadBajaCalidad' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasCosechas, setHasCosechas] = useState(false);  // Nuevo estado para verificar si hay cosechas
  const navigate = useNavigate();


  useEffect(() => {
    const total =
      (parseFloat(watchCantidadAltaCalidad) || 0) +
      (parseFloat(watchCantidadMedianaCalidad) || 0) +
      (parseFloat(watchCantidadBajaCalidad) || 0);
    setCantidadTotal(total);
  }, [watchCantidadAltaCalidad, watchCantidadMedianaCalidad, watchCantidadBajaCalidad]);

  // Definir sugerencias de cosecha
  const sugerenciasCosecha = {
    'aguacate hass': {
      rendimientoEsperado: "100 - 300 kg por árbol adulto",
      almacenamiento: "Conservar en lugar fresco a 5-7°C para prolongar su vida útil.",
      comercializacion: "Exportación es común, verifica estándares de calidad."
    },
    'aguacate criollo': {
      rendimientoEsperado: "60 - 200 kg por árbol adulto",
      almacenamiento: "Menor tiempo de conservación, vender rápidamente.",
      comercializacion: "Preferido en mercados locales por su sabor."
    },
    'aguacate papelillo': {
      rendimientoEsperado: "80 - 250 kg por árbol adulto",
      almacenamiento: "Puede almacenarse hasta 10 días en refrigeración.",
      comercializacion: "Usado para aceites y consumo fresco."
    }
  };

  const variedadKey = variedad ? variedad.toLowerCase() : null;
  const sugerencia = variedadKey && sugerenciasCosecha[variedadKey];

  const onSubmit = handleSubmit(async (data) => {
    try {
      const cantidadTotal =
        (parseFloat(data.cantidadAltaCalidad) || 0) +
        (parseFloat(data.cantidadMedianaCalidad) || 0) +
        (parseFloat(data.cantidadBajaCalidad) || 0);

      const datosParaEnviar = {
        cantidadAltaCalidad: parseFloat(data.cantidadAltaCalidad) || 0,
        cantidadMedianaCalidad: parseFloat(data.cantidadMedianaCalidad) || 0,
        cantidadBajaCalidad: parseFloat(data.cantidadBajaCalidad) || 0,
        cantidadTotal: cantidadTotal,
        idPlantacion: Number(plantacionId),
      };

      await postCosecha(datosParaEnviar);

      if (onCreated) {
        onCreated();
      }

      reset();
    } catch (error) {
      console.error('Error al guardar la cosecha:', error);
    }
  });

  const handleModalOpen = async () => {
    try {
      const cosechas = await getCosechaByPlantacionId(plantacionId);
      setHasCosechas(cosechas && cosechas.length > 0);  // Verificar si hay cosechas
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error al verificar cosechas:', error);
    }
  };

  const handleCosechaTerminada = async () => {
    if (!hasCosechas) {
      return; // Bloquear la acción si no hay cosechas
    }

    try {
      await completarPlantacion(plantacionId);
      navigate(`/informe/${plantacionId}`);
    } catch (error) {
      console.error('Error al completar la plantación:', error);
      alert('Ocurrió un error al completar la plantación.');
    }
  };

  return (
    <>
      <div className="contenedor-principal">
        {/* Formulario */}
        <div className="preparacion-terreno-container">
          <h3>Agregar Cosecha</h3>
          <form className="preparacion-form" onSubmit={onSubmit}>
            <div className="form-group">
              <label className="form-label">Calidad Alta (kg):</label>
              <input type="number" step="any" className="form-input" {...register('cantidadAltaCalidad', { required: true })} />
              {errors.cantidadAltaCalidad && <span className="form-error">Requerido</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Calidad Media (kg):</label>
              <input type="number" step="any" className="form-input" {...register('cantidadMedianaCalidad', { required: true })} />
              {errors.cantidadMedianaCalidad && <span className="form-error">Requerido</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Calidad Baja (kg):</label>
              <input type="number" step="any" className="form-input" {...register('cantidadBajaCalidad', { required: true })} />
              {errors.cantidadBajaCalidad && <span className="form-error">Requerido</span>}
            </div>

            <div className="form-group">
              <label>Cantidad Total (kg):</label>
              <input type="number" step="any" value={cantidadTotal} readOnly className='form-input' />
            </div>

            <button className="form-button">Guardar</button>
          </form>

         
        </div>
        

        {/* Modal de advertencia */}
        {isModalOpen && (
          <div className="modal-overlay-2">
            <div className="modal-2">
              <img src={advertencia} alt="Advertencia" className="img-advertencia" />
              <h3>¿Terminar cosecha?</h3>
              {hasCosechas ? (
                <>
                  <p>Esta acción <strong>Terminará</strong> el ciclo de la cosecha y se empezará uno nuevo sin los registros anteriores.</p>
                  <button className="confirmar" onClick={handleCosechaTerminada}>
                    Confirmar
                  </button>
                </>
              ) : (
                <p>No se puede completar la plantación porque aún no tiene registros de cosechas.</p>
              )}
              <button className="cancelar" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </button>
            </div>
          </div>
        )}
        <div className="columna-derecha">
   
          {/* Sugerencias dinámicas según la variedad */}
          {sugerencia && (
            <div className="sugerencias">
              <h4><strong>🌱 Cosecha  {variedad.charAt(0).toUpperCase() + variedad.slice(1)}</strong></h4>
              <p><strong>🔹 Rendimiento esperado:</strong> {sugerencia.rendimientoEsperado}</p>
              <p><strong>📦 Almacenamiento:</strong> {sugerencia.almacenamiento}</p>
              <p><strong>📈 Comercialización:</strong> {sugerencia.comercializacion}</p>
            </div>
          )}
          <button onClick={handleModalOpen} className="form-button-terminar" >
              Terminar Cosecha
            </button>
            </div>
      </div>
    </>
  );
}
