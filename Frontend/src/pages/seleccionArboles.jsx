import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSeleccionByPlantacionId } from '../api/seleccionArboles.api';
import { SeleccionArbolesForm } from '../components/seleccionArbolesForm';
import atras from "../img/atras.png";
import '../styles/formulario.css'



export function SeleccionArbolesPage() {
  const { plantacionId } = useParams(); // /seleccion-arboles/:plantacionId
  const idPlantacion = Number(plantacionId); // Convierte plantacionId a número
  // console.log("plantacionId:", idPlantacion); // Verifica que sea un número
  const [selecciones, setSelecciones] = useState([]);
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

  useEffect(() => {
    if (idPlantacion) {
      loadSelecciones();
    }
  }, [idPlantacion]);

  // Obtener el ID de la primera selección (si existe)
  const seleccionId = selecciones.length > 0 ? selecciones[0].id : null;

  // Botón para ir a Preparacion terreno 
  const handleRedirectToGestionTareas = () => {
    navigate(`/gestionTareas/${idPlantacion}`);
  };

  return (
    <div>

      
      <button className="boton-volver" onClick={handleRedirectToGestionTareas}>
                 <img src={atras} alt="Eliminar" />
            </button>

      <h2>Selección de Árboles - Plantación {idPlantacion}</h2>

      {/* Formulario con checkboxes y fechas automáticas */}
      <SeleccionArbolesForm
        plantacionId={idPlantacion} // Pasar el ID convertido a número
        seleccionId={seleccionId}
        onCreated={loadSelecciones}
      />


      {/* Listado de selecciones (historial)
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
      )} */}
    </div>
  );
}