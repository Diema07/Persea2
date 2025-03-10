// src/pages/InformeCompletoPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { descargarInformeCompletoPDF } from '../api/informe.api';
import atras from "../img/atras.png";


export function InformeCompletoPage() {
  const { plantacionId } = useParams();
  const [htmlInforme, setHtmlInforme] = useState('');
  const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
  

  useEffect(() => {
    const fetchInformeHtml = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/informes/informe-completo/${plantacionId}/?formato=html`,
          {
            credentials: 'include', // importante si la API requiere autenticación/cookies
            headers: { 'Content-Type': 'text/html' },
          }
        );
        const html = await response.text();
        console.log("HTML recibido:", html);
        setHtmlInforme(html);
      } catch (error) {
        console.error('Error al obtener el informe HTML:', error);
      } finally {
        setLoading(false);
      }
    };

    if (plantacionId) {
      fetchInformeHtml();
    }
  }, [plantacionId]);

  const handleDescargarPDF = () => {
    descargarInformeCompletoPDF(plantacionId);
  };

  if (loading) return <p>Cargando...</p>;
  if (!htmlInforme) return <p>No hay datos de informe.</p>;

  const handleRedirectToGestionTareas = () => {
    navigate(`/gestionTareas/${plantacionId}`);
  };

  return (
    <div>

      <button
        onClick={handleRedirectToGestionTareas}
      >
        <img 
          src={atras} 
          alt="Flecha atras" 
          style={{ width: '35px', height: '35px' }} // Ajusta el tamaño de la flecha
        />
      </button>

      <h2>Informe Completo de Plantación {plantacionId}</h2>
      <button onClick={handleDescargarPDF}>Descargar PDF</button>
      {/* Incrustar el HTML del informe dentro de un contenedor */}
      <div
        style={{ marginTop: '20px' }}
        dangerouslySetInnerHTML={{ __html: htmlInforme }}
      />
    </div>
  );
}