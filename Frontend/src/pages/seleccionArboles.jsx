// seleccionArboles.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSeleccionByPlantacionId } from '../api/seleccionArboles.api';
import { getPlantacionById } from '../api/plantaciones.api'; // Importa la función para obtener la plantación
import { SeleccionArbolesForm } from '../components/seleccionArbolesForm';

import '../styles/formulario.css';
import logo8 from "../img/img8.png";

export function SeleccionArbolesPage() {
  const { plantacionId } = useParams(); // /seleccion-arboles/:plantacionId
  const idPlantacion = Number(plantacionId); // Convierte plantacionId a número
  const [selecciones, setSelecciones] = useState([]);
  const [nombreParcela, setNombreParcela] = useState('');
  const navigate = useNavigate();

  // Cargar las selecciones existentes
  const loadSelecciones = async () => {
    if (!idPlantacion) {
      console.error("plantacionId es undefined o no es un número");
      return;
    }
    try {
      const data = await getSeleccionByPlantacionId(idPlantacion);
      setSelecciones(data);
    } catch (error) {
      console.error('Error al obtener la selección de árboles:', error);
    }
  };

  // Cargar datos de la plantación (nombreParcela)
  const loadPlantacion = async () => {
    try {
      const response = await getPlantacionById(idPlantacion);
      // Si la respuesta contiene la propiedad "data", la usamos; de lo contrario, usamos la respuesta directamente.
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
      loadSelecciones();
      loadPlantacion();
    }
  }, [idPlantacion]);

  // Obtener el ID de la primera selección (si existe)
  const seleccionId = selecciones.length > 0 ? selecciones[0].id : null;

  // Botón para ir a Gestión de Tareas (o Preparación Terreno)
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
          Selección de Árboles - Plantación {nombreParcela || idPlantacion}
        </h2>
  
        {/* Formulario con checkboxes y fechas automáticas */}
        <SeleccionArbolesForm
          plantacionId={idPlantacion} // Pasar el ID convertido a número
          seleccionId={seleccionId}
          onCreated={loadSelecciones}
        />
  
        {/*
        <h3>Historial de Selecciones:</h3>
        {selecciones.length === 0 ? (
          <p>No hay selecciones registradas.</p>
        ) : (
          <ul>
            {selecciones.map((sel) => (
              <li key={sel.id}>
                <strong>ID:</strong> {sel.id} <br />
                <strong>Variedad:</strong> {sel.seleccionVariedades || 'No definida'} <br />
                <strong>Preparación Colinos:</strong> {sel.preparacionColinos || 'No definida'} <br />
                <strong>Excavación Hoyos:</strong> {sel.excavacionHoyos || 'No definida'} <br />
                <strong>Plantación:</strong> {sel.plantacion || 'No definida'} <br />
                <hr />
              </li>
            ))}
          </ul>
        )}
        */}
      </div>
    </div>
  );
}
