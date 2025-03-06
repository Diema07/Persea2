// src/pages/InformeCompletoPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getInformeCompleto, descargarInformeCompletoPDF } from '../api/informe.api';

export function InformeCompletoPage() {
  const { plantacionId } = useParams();  // URL param /informe-completo/:plantacionId
  const [informeData, setInformeData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar el informe al montar
  useEffect(() => {
    const fetchInforme = async () => {
      try {
        const data = await getInformeCompleto(plantacionId);
        setInformeData(data);
      } catch (error) {
        console.error('Error al obtener el informe:', error);
      } finally {
        setLoading(false);
      }
    };

    if (plantacionId) {
      fetchInforme();
    }
  }, [plantacionId]);

  const handleDescargarPDF = () => {
    descargarInformeCompletoPDF(plantacionId);
  };

  if (loading) return <p>Cargando...</p>;
  if (!informeData) return <p>No hay datos de informe.</p>;

  return (
    <div>
      <h2>Informe Completo de Plantación {plantacionId}</h2>
      <button onClick={handleDescargarPDF}>
        Descargar PDF
      </button>

      {/* Mostrar el JSON en pantalla (ejemplo) */}
      <pre style={{ whiteSpace: 'pre-wrap', marginTop: '20px' }}>
        {JSON.stringify(informeData, null, 2)}
      </pre>
    </div>
  );
}
