// src/pages/informeGeneral.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPlantacionesCosechaReciente } from '../api/informeGeneral.api';
import { descargarInformeCompletoPDF } from '../api/informe.api';
import PlantacionCompletasSelect from '../components/informeGeneralSelect';

export function InformeGeneralPage() {
  const [plantaciones, setPlantaciones] = useState([]);
  const [selectedPlantacionId, setSelectedPlantacionId] = useState(null);
  const [htmlInforme, setHtmlInforme] = useState('');
  const [loadingPlantaciones, setLoadingPlantaciones] = useState(false);
  const [loadingInforme, setLoadingInforme] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Cargar la lista de plantaciones
  useEffect(() => {
    const fetchPlantaciones = async () => {
      setLoadingPlantaciones(true);
      try {
        const response = await getPlantacionesCosechaReciente();
        setPlantaciones(response);
      } catch (err) {
        setError('Error al cargar las plantaciones');
      } finally {
        setLoadingPlantaciones(false);
      }
    };
    fetchPlantaciones();
  }, []);

  // Cada vez que se selecciona una plantación, cargar su informe en HTML
  useEffect(() => {
    if (selectedPlantacionId) {
      const fetchInformeHtml = async () => {
        setLoadingInforme(true);
        try {
          const response = await fetch(
            `http://localhost:8000/informes/informe-completo/${selectedPlantacionId}/?formato=html`,
            {
              credentials: 'include',
              headers: { 'Content-Type': 'text/html' },
            }
          );
          const html = await response.text();
          setHtmlInforme(html);
        } catch (err) {
          setError('Error al cargar el informe');
        } finally {
          setLoadingInforme(false);
        }
      };
      fetchInformeHtml();
    } else {
      setHtmlInforme('');
    }
  }, [selectedPlantacionId]);

  // Maneja la selección en el select
  const handleSelect = (plantacionId) => {
    setSelectedPlantacionId(plantacionId);
  };

  // Descargar el informe en PDF
  const handleDescargarPDF = () => {
    if (selectedPlantacionId) {
      descargarInformeCompletoPDF(selectedPlantacionId);
    }
  };

  

  return (
    <div>
      <h1>Informe Completo con Selección de Plantación</h1>
      {loadingPlantaciones && <p>Cargando plantaciones...</p>}
      {error && <p>{error}</p>}
      {!loadingPlantaciones && (
        <PlantacionCompletasSelect 
          plantaciones={plantaciones}
          onSelect={handleSelect}
        />
      )}
      {selectedPlantacionId && (
        <>
          <div style={{ marginTop: '20px' }}>
            <button onClick={handleDescargarPDF}>Descargar PDF</button>
          </div>
          {loadingInforme ? (
            <p>Cargando informe...</p>
          ) : htmlInforme ? (
            <div style={{ marginTop: '20px' }} dangerouslySetInnerHTML={{ __html: htmlInforme }} />
          ) : (
            <p>No hay datos de informe.</p>
          )}
        </>
      )}
    </div>
  );
}
