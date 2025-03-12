import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCosechaByPlantacionId } from '../api/cosecha.api';
import { getSeleccionByPlantacionId } from '../api/seleccionArboles.api';
import { CosechaForm } from '../components/cosechaForm';
import atras from "../img/atras.png";
import '../styles/historial.css';


export function CosechaPage() {
  const { plantacionId } = useParams();
  const [cosechas, setCosechas] = useState([]);
  const navigate = useNavigate();

  const [variedad, setVariedad] = useState(null);
 

  // Carga los registros de cosecha existentes
  const loadCosechas = async () => {
    if (!plantacionId) {
      console.error("plantacionId es undefined o no es un número");
      return;
    }
    try {
      const data = await getCosechaByPlantacionId(Number(plantacionId));
      setCosechas(data || []);
    } catch (error) {
      console.error('Error al obtener registros de cosecha:', error);
    }
  };

  const loadVariedad = async () => {
    try {
      const seleccion = await getSeleccionByPlantacionId(Number(plantacionId));
        
      if (seleccion.length > 0) {
        setVariedad(seleccion[0].seleccionVariedades);
      } else {
        console.warn("No se encontró selección de variedades para la plantación.");
      }
    } catch (error) {
      console.error("Error al obtener la variedad de la selección de árboles:", error);
    }
  };
  

  // Al montar o cambiar de plantacionId, carga las cosechas
  useEffect(() => {
    if (plantacionId) {
      loadCosechas();
      loadVariedad();
    }
  }, [plantacionId]);

  // Botón para ir a Gestión de Tareas 
  const handleRedirectToGestionTareas = () => {
    navigate(`/gestionTareas/${plantacionId}`);
  };

  return (
    <div>


      <button className="boton-volver" onClick={handleRedirectToGestionTareas}>
           <img src={atras} alt="Eliminar" />
      </button>


      <h2>Cosecha - Plantación {plantacionId}</h2>

      {/* Formulario para crear/actualizar cosechas */}
      <CosechaForm
        plantacionId={plantacionId}
        variedad={variedad}
        onCreated={loadCosechas}  // callback para recargar la lista
      />

      <h3 className='sub-titulo-form'>Historial de Cosechas:</h3> {/* Aplica la clase sub-titulo-form */}
      {cosechas.length === 0 ? (
        <p>No hay cosechas registradas.</p>
      ) : (
        <ul className="riego-list"> {/* Reutiliza la clase riego-list */}
          {cosechas.map((c) => (
            <li key={c.id} className="riego-item"> {/* Reutiliza la clase riego-item */}
              <p><strong>Fecha de Cosecha:</strong> {c.fechaCosecha || '---'}</p>
              <p><strong>Calidad Alta:</strong> {c.cantidadAltaCalidad || 0} kg</p>
              <p><strong>Calidad Media:</strong> {c.cantidadMedianaCalidad || 0} kg</p>
              <p><strong>Calidad Baja:</strong> {c.cantidadBajaCalidad || 0} kg</p>
              <p><strong>Total Cantidad:</strong> {c.cantidadTotal || 0} kg</p>
              
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
