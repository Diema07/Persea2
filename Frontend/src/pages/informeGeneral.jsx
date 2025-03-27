import React, { useState } from 'react';
import { Header } from '../components/Header';
import { InformeGeneralForm } from '../components/informeGeneralForm';
import advertencia from '../img/advertencia.png';
import '../styles/plantacionCrear.css';
export function InformeGeneralPage() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    window.location.href = "http://localhost:8000/accounts/logout/";
  };

  return (
    <>
      
      <Header onLogoutClick={() => setShowLogoutModal(true)} />
      
      <InformeGeneralForm />

    
      {showLogoutModal && (
        <div className="modal-overlay-2">
          <div className="modal-2">
            <img src={advertencia} alt="Advertencia" className='img-advertencia' />
            <h3>¿Estás seguro/a de cerrar sesión?</h3>
                <p>Serás redirigido/a a la página de inicio de sesión.</p>
              <button className="confirmar" onClick={handleLogout}>Sí, cerrar sesión</button>
              <button className="cancelar" onClick={() => setShowLogoutModal(false)}>Cancelar</button>
            
          </div>
        </div>
      )}
    </>
  );
}