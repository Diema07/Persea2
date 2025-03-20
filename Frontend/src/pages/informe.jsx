import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { InformeCompletoForm } from '../components/informeForm';
import logo8 from "../img/img8.png";

export function InformeCompletoPage() {
  const { plantacionId } = useParams();
  const navigate = useNavigate();

  const handleRedirectToGestionTareas = () => {
    navigate(`/gestionTareas/${plantacionId}`);
  };

  return (
    <div>
      <button className="boton-volver" onClick={handleRedirectToGestionTareas}>
        <img src={logo8} alt="Volver" />
        <p className='parrafo-volver'>Volver</p>
      </button>

      {/* Mostrar el informe completo */}
      <InformeCompletoForm plantacionId={plantacionId} />
    </div>
  );
}
