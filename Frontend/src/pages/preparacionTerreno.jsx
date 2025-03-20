// preparacionTerreno.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPreparacionByPlantacionId } from '../api/preparacionTerreno.api';
import { getPlantacionById } from '../api/plantaciones.api';
import { PreparacionTerrenoForm } from '../components/preparacionTerrenoForm';
import '../styles/historial.css';
import logo8 from "../img/img8.png";

export function PreparacionTerrenoPage() {
  const { plantacionId } = useParams();
  const idPlantacion = Number(plantacionId);
  const [preparaciones, setPreparaciones] = useState([]);
  const [nombreParcela, setNombreParcela] = useState('');
  const navigate = useNavigate();

  // Cargar preparaciones
  const loadPreparaciones = async () => {
    if (!idPlantacion) {
      console.error("plantacionId es undefined o no es un número");
      return;
    }
    try {
      const data = await getPreparacionByPlantacionId(idPlantacion);
      setPreparaciones(data);
    } catch (error) {
      console.error('Error al obtener preparaciones:', error);
    }
  };

  // Cargar datos de la plantación (nombreParcela)
  const loadPlantacion = async () => {
    try {
      const response = await getPlantacionById(idPlantacion);
      // Si la respuesta contiene la propiedad "data", la usamos; si no, usamos la respuesta directamente.
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

  useEffect(() => {
    if (idPlantacion) {
      loadPreparaciones();
      loadPlantacion();
    }
  }, [idPlantacion]);

  const idpreparacion = preparaciones.length > 0 ? preparaciones[0].id : null;

  const handleRedirectToGestionTareas = () => {
    navigate(`/gestionTareas/${idPlantacion}`);
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
          Preparación de Terreno - {nombreParcela}
        </h2>
  
        {/* Componente del formulario de preparación de terreno */}
        <PreparacionTerrenoForm
          plantacionId={idPlantacion}
          preparacionId={idpreparacion}
          onCreated={loadPreparaciones}
        />
      </div>
    </div>
  );
}
