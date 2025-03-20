import React, { useState, useEffect } from 'react';
import { getPlantacionesCosechaReciente } from '../api/informeGeneral.api';
import { InformeHtml, descargarInformeCompletoPDF } from '../api/informe.api';
import '../styles/infoGeneral.css';

export function InformeGeneralForm() {
  const [plantaciones, setPlantaciones] = useState([]);
  const [selectedPlantacionId, setSelectedPlantacionId] = useState('');
  const [htmlInforme, setHtmlInforme] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar las plantaciones al montar el componente
  useEffect(() => {
    const fetchPlantaciones = async () => {
      try {
        const data = await getPlantacionesCosechaReciente();
        setPlantaciones(data);
      } catch (err) {
        setError('Error al cargar las plantaciones.');
      } finally {
        setLoading(false);
      }
    };
    fetchPlantaciones();
  }, []);

  // Cargar el informe cuando se selecciona una plantación
  useEffect(() => {
    if (selectedPlantacionId) {
      const fetchInforme = async () => {
        try {
          const html = await InformeHtml(selectedPlantacionId);
          setHtmlInforme(html);
        } catch (err) {
          setError('Error al cargar el informe.');
        }
      };
      fetchInforme();
    } else {
      setHtmlInforme('');
    }
  }, [selectedPlantacionId]);

  // Manejar selección en el select
  const handleSelectChange = (event) => {
    setSelectedPlantacionId(event.target.value);
  };

  // Descargar el informe en PDF
  const handleDescargarPDF = () => {
    if (selectedPlantacionId) {
      descargarInformeCompletoPDF(selectedPlantacionId);
    }
  };

  return (
    <div className="informe-container">
      <h1>Informe de Cosechas Terminadas</h1>

      {loading && <p>Cargando plantaciones...</p>}
      {error && <p>{error}</p>}

      {/* Select de plantaciones */}
      {!loading && (
        <div className="select-container">
          <select onChange={handleSelectChange} value={selectedPlantacionId} className="custom-select">
            <option value="">Seleccione una plantación</option>
            {plantaciones.map((plantacion) => (
              <option key={plantacion.id} value={plantacion.id}>
                {plantacion.nombreParcela} - {plantacion.fechaCosecha || 'Sin fecha'}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Mostrar informe */}
      {selectedPlantacionId && (
        <>
          {htmlInforme ? (
            <div className="informe-html" dangerouslySetInnerHTML={{ __html: htmlInforme }} />
          ) : (
            <p>No hay datos de informe.</p>
          )}
          <button onClick={handleDescargarPDF}>Descargar PDF</button>
        </>
      )}
    </div>
  );
}
