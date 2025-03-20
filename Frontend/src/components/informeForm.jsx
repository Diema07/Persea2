import React, { useEffect, useState } from 'react';
import { InformeHtml, descargarInformeCompletoPDF } from '../api/informe.api';

export function InformeCompletoForm({ plantacionId }) {
  const [htmlInforme, setHtmlInforme] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerInforme = async () => {
      try {
        const html = await InformeHtml(plantacionId);
        setHtmlInforme(html);
      } catch (error) {
        console.error('Error al obtener el informe HTML:', error);
      } finally {
        setLoading(false);
      }
    };

    if (plantacionId) {
      obtenerInforme();
    }
  }, [plantacionId]);

  const handleDescargarPDF = () => {
    descargarInformeCompletoPDF(plantacionId);
  };

  if (loading) return <p>Cargando...</p>;
  if (!htmlInforme) return <p>No hay datos de informe.</p>;

  return (
    <div className="informe-container">
      <div className="informe-html" dangerouslySetInnerHTML={{ __html: htmlInforme }} />
      <button onClick={handleDescargarPDF}>Descargar PDF</button>
    </div>
  );
}
