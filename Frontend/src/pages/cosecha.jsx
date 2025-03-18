// src/pages/CosechaPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCosechaByPlantacionId } from '../api/cosecha.api';
import { getSeleccionByPlantacionId } from '../api/seleccionArboles.api';
import { getPlantacionById } from '../api/plantaciones.api';
import { CosechaForm } from '../components/cosechaForm';
import logo8 from "../img/img8.png";
import '../styles/historial.css';

export function CosechaPage() {
  const { plantacionId } = useParams();
  const [cosechas, setCosechas] = useState([]);
  const [variedad, setVariedad] = useState(null);
  const [nombreParcela, setNombreParcela] = useState('');
  const navigate = useNavigate();

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

  // Cargar la variedad a partir de la selección de árboles
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

  // Cargar datos de la plantación (nombreParcela)
  const loadPlantacion = async () => {
    try {
      const response = await getPlantacionById(Number(plantacionId));
      // Si la respuesta contiene "data", la usamos; de lo contrario, usamos la respuesta directamente.
      const plantacion = response && response.data ? response.data : response;
      if (plantacion && plantacion.nombreParcela) {
        setNombreParcela(plantacion.nombreParcela);
      } else {
        console.warn('La propiedad nombreParcela no se encontró en la respuesta.');
      }
    } catch (error) {
      console.error('Error al obtener datos de la plantación:', error);
    }
  };

  // Al montar o cambiar el plantacionId, carga las cosechas, variedad y datos de la plantación
  useEffect(() => {
    if (plantacionId) {
      loadCosechas();
      loadVariedad();
      loadPlantacion();
    }
  }, [plantacionId]);

  // Botón para ir a Gestión de Tareas
  const handleRedirectToGestionTareas = () => {
    navigate(`/gestionTareas/${plantacionId}`);
  };

  return (
    <div className="page-background">
      <div className="page-content">
        {/* Botón de volver */}
        <button className="boton-volver" onClick={handleRedirectToGestionTareas}>
          <img src={logo8} alt="Eliminar" />
          <p className='parrafo-volver'>volver</p>
        </button>
  
        {/* Título principal */}
        <h2 className='subtitulo-principal'>
          Cosecha - Plantación {nombreParcela || plantacionId}
        </h2>
  
        {/* Formulario para crear/actualizar cosechas */}
        <CosechaForm
          plantacionId={plantacionId}
          variedad={variedad}
          onCreated={loadCosechas}  // callback para recargar la lista
        />
  
        {/* Historial de cosechas */}
        <h3 className='sub-titulo-form'>Historial de Cosechas:</h3>
        {cosechas.length === 0 ? (
          <p>No hay cosechas registradas.</p>
        ) : (
          <ul className="riego-list">
            {cosechas.map((c) => (
              <li key={c.id} className="riego-item">
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
    </div>
  );
}
