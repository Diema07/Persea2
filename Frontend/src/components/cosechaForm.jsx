import React, { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import advertencia from '../img/advertencia.png'
import { postCosecha, completarPlantacion } from '../api/cosecha.api';

export function CosechaForm({ plantacionId, onCreated }) {
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

      reset(); // Limpiar formulario después de enviar los datos
    } catch (error) {
      console.error('Error al guardar la cosecha:', error);
    }
  });

  // const handleCosechaTerminada = async () => {
  //   const confirmacion = window.confirm(
  //     '¿Estás seguro de que deseas marcar la cosecha como terminada? Esta acción desactivará la cosecha y la plantación.'
  //   );

  //   if (confirmacion) {
  //     try {
  //       await desactivarCosechaYPlantacion(plantacionId);
  //       alert('Cosecha y plantación desactivadas correctamente.');
  //       window.location.reload(); // Recargar la página para reflejar los cambios
  //     } catch (error) {
  //       console.error('Error al desactivar cosecha y plantación:', error);
  //       alert('Ocurrió un error al desactivar la cosecha y la plantación.');
  //     }
  //   }
  // };
  const handleCosechaTerminada = async () => {
    setIsModalOpen(true);
  
      try {
        await completarPlantacion(plantacionId);
        
         window.location.href = "http://localhost:3000/inicio-plantacion";
       } catch (error) {
        console.error('Error al completar la plantación:', error);
        alert('Ocurrió un error al completar la plantación.');
      }
     
    };
  
  // const handleCosechaTerminada = async () => {
  //   const confirmacion = window.confirm(
  //     '¿Estás seguro de que deseas marcar la cosecha como terminada? Esto completará la plantación y creará una nueva automáticamente.'
  //   );

  //   if (confirmacion) {
  //     try {
  //       await completarPlantacion(plantacionId);
  //       alert('Plantación completada y nueva plantación creada correctamente.');
  //       window.location.href = "http://localhost:3000/inicio-plantacion";
  //     } catch (error) {
  //       console.error('Error al completar la plantación:', error);
  //       alert('Ocurrió un error al completar la plantación.');
  //     }
  //   }
  // };

  return (
    <>
    <div className="preparacion-terreno-container">
      <h3>Agregar Cosecha</h3>
      <form className="preparacion-form" onSubmit={onSubmit}>
        {/* CANTIDAD ALTA CALIDAD */}
        <div className="form-group">
          <label className="form-label">Calidad Alta (kg):</label>
          <input type="number" step="any" className="form-input" {...register('cantidadAltaCalidad', { required: true })} />
          {errors.cantidadAltaCalidad && <span className="form-error">Requerido</span>}
        </div>

        {/* CANTIDAD MEDIANA CALIDAD */}
        <div className="form-group">
          <label className="form-label">Calidad Media (kg):</label>
          <input type="number" step="any" className="form-input" {...register('cantidadMedianaCalidad', { required: true })} />
          {errors.cantidadMedianaCalidad && <span className="form-error">Requerido</span>}
        </div>

        {/* CANTIDAD BAJA CALIDAD */}
        <div className="form-group">
          <label className="form-label">Calidad Baja (kg):</label>
          <input type="number" step="any" className="form-input" {...register('cantidadBajaCalidad', { required: true })} />
          {errors.cantidadBajaCalidad && <span className="form-error">Requerido</span>}
        </div>

        {/* CANTIDAD TOTAL (solo lectura) */}
        <div className='form-group'>
          <label>Cantidad Total (kg):</label>
          <input
            type="number"
            step="any"
            value={cantidadTotal}
            readOnly
            className='form-input'
          />
        </div>

        <button className="form-button">Listo</button>
      </form>

      <button
        onClick={handleCosechaTerminada}
        style={{
          backgroundColor: '#ff4444',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '16px',
        }}
      >
        Cosecha Terminada
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
                <button className="confirmar" onClick={() => setIsModalOpen(false)}>
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
