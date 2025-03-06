import "../styles/plantacionCrear.css"; 
import { Link } from 'react-router-dom';
import { useState } from "react";

//imagenes
import plantaIcon from "../img/planta.png";
import deleteIcon from "../img/boton-eliminar.png";

export function Taskcard({ task }) {
    
    const [isModalOpen, setIsModalOpen] = useState(false);

  
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);


    return (
        <div className="main1">
            <div className="cuadro">
                <button className="boton-eliminar" onClick={() => openModal(true)}>
                    <img src={deleteIcon} alt="Eliminar" />
                </button>

                <div className="icono">
                    <img src={plantaIcon} alt="Planta" />
                </div>

                <h2 className="titulo">{task.nombreParcela}</h2>
                <p className="parrafo">Para lograr una buena cosecha, se deben tener en cuenta algunos aspectos clave.</p>
                <Link to={`/gestionTareas/${task.id}`} className="boton-ver-mas">Ver más</Link>
            </div>

            {isModalOpen && (
                <div className="modal-overlay-2">
                    <div className="modal-2">
                        <p>Tu plantación de "<label className="parcela-1">{task.nombreParcela}</label>" será elimina de tus plantaciones. ¿Estas seguro que quiere eliminarla?</p>
                        <button className="confirmar" onClick={() => closeModal(false)}>Sí, eliminar</button>
                        <button className="cancelar" onClick={() => closeModal(false)}>Cancelar</button>
                        
                    </div>
                </div>
            )}
        </div>
    );
}

