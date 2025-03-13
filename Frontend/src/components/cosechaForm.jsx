import React, { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import advertencia from '../img/advertencia.png';
import { postCosecha, completarPlantacion } from '../api/cosecha.api';
import { useNavigate } from 'react-router-dom';

export function CosechaForm({ plantacionId, variedad, onCreated }) {  // Añadir variedad como prop
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
  const navigate = useNavigate();

  // Resetear el formulario al cargar la página
  useEffect(() => {
    reset();
  }, [reset]);

  useEffect(() => {
    const total =
      (parseFloat(watchCantidadAltaCalidad) || 0) +
      (parseFloat(watchCantidadMedianaCalidad) || 0) +
      (parseFloat(watchCantidadBajaCalidad) || 0);
    setCantidadTotal(total);
  }, [watchCantidadAltaCalidad, watchCantidadMedianaCalidad, watchCantidadBajaCalidad]);

  // 📌 Definir sugerencias de cosecha
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

  // 📌 Convertir variedad a minúsculas y verificar que existe en el objeto
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

  const handleModalOpen =  () => {
    setIsModalOpen(true);
    };

  const handleCosechaTerminada = async () => {
  
    try {
      await completarPlantacion(plantacionId);
      navigate(`/informe-completo/${plantacionId}`);
    } catch (error) {
      console.error('Error al completar la plantación:', error);
      alert('Ocurrió un error al completar la plantación.');
    }
  };

  
  return (
    <>
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

            {/* 📌 Sugerencias dinámicas según la variedad */}
         {sugerencia && (
          <div className="sugerencias">
            <h4>🌱 Cosecha {variedad.charAt(0).toUpperCase() + variedad.slice(1)}</h4>
            <p><strong>🔹 Rendimiento esperado:</strong> {sugerencia.rendimientoEsperado}</p>
            <p><strong>📦 Almacenamiento:</strong> {sugerencia.almacenamiento}</p>
            <p><strong>📈 Comercialización:</strong> {sugerencia.comercializacion}</p>
          </div>
        )}

          <button className="form-button">Guardar</button>
        </form>


        <button onClick={handleModalOpen} className="form-button" style={{ backgroundColor: '#ff4444' }}>
          Terminar Cosecha
        </button>

       
      </div>
       {/* Modal de advertencia */}
       {isModalOpen && (
            <div className="modal-overlay-2">
              <div className="modal-2">
                <img src={advertencia} alt="Advertencia" className="img-advertencia" />
                <h3>¿Terminar cosecha?</h3>
                <p>
                ¿Estás seguro de que deseas marcar la cosecha como terminada? Esta acción <strong>desactivará </strong>la cosecha y la plantación.
                </p>
                <button className="confirmar" onClick={(handleCosechaTerminada)}>
                  Confirmar
                </button>
                
                <button className="cancelar" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </button>
              </div>
            </div>
          )}
    </>
  );
}
