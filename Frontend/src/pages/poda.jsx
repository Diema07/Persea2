// src/pages/PodaPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPodaByPlantacionId } from '../api/poda.api';
import { PodaForm } from '../components/podaForm';
import atras from "../img/atras.png";
import '../styles/historial.css';
import '../styles/stylee.css'

export function PodaPage() {
  const { plantacionId } = useParams();
  const idPlantacion = Number(plantacionId);
  const [podas, setPodas] = useState([]);
  const navigate = useNavigate();

  // Carga los registros de poda existentes
  const loadPodas = async () => {
    if (!idPlantacion) {
      console.error("plantacionId es undefined o no es un número");
      return;
    }
    try {
      const data = await getPodaByPlantacionId(idPlantacion);
      setPodas(data);
    } catch (error) {
      console.error('Error al obtener registros de poda:', error);
    }
  };

  useEffect(() => {
    if (idPlantacion) {
      loadPodas();
    }
  }, [idPlantacion]);

  // Obtener el ID de la primera poda (si existe)
  const podaId = podas.length > 0 ? podas[0].id : null;

  // Botón para ir a Preparacion terreno 
  const handleRedirectToGestionTareas = () => {
    navigate(`/gestionTareas/${idPlantacion}`);
  };

  return (
    <div>

      
     
      <button className="boton-volver" onClick={handleRedirectToGestionTareas}>
           <img src={atras} alt="Eliminar" />
      </button>

      <h2 className='subtitulo-principal'>Poda - Plantación {idPlantacion}</h2>

      {/* Formulario */}
      <PodaForm
        plantacionId={idPlantacion}
        podaId={podaId}
        onCreated={loadPodas}
      />


      {/* Historial de Podas */}
      <h3 className='sub-titulo-form'>Historial de Podas:</h3> 
        {podas.length === 0 ? (
          <p>No hay registros de poda.</p>
        ) : (
          <ul className="riego-list"> 
            {podas.map((p) => (
              <li key={p.id} className="riego-item"> 
                <p><strong>Fecha de Poda:</strong> {p.fechaPoda || '---'}</p>
                <p><strong>Tipo de Poda:</strong> {p.tipoPoda === 'formacion' ? 'Formación' : p.tipoPoda === 'mantenimiento' ? 'Mantenimiento' : p.tipoPoda ==='rejuvenecimiento' ? 'Rejuvenecimiento' : 'Sanitaria'}</p>
                <p><strong>Herramientas Usadas:</strong> {p.herramientasUsadas === 'tijeras' ? 'Tijeras' : p.herramientasUsadas === 'serrucho' ? 'Serrucho' : 'Motosierra'}</p>
                <p><strong>Técnicas Usadas:</strong> {p.tecnicasUsadas === 'ralo' ? 'Raleo' : p.tecnicasUsadas === 'deschuponado' ? 'Deschuponado' : 'Rebaje'}</p>
                
              </li>
            ))}
          </ul>
        )}
    </div>
  );
}
