import "../styles/plantacionCrear.css"; 
import { Link } from 'react-router-dom';

//imagenes
import plantaIcon1 from "../img/plantacion1.png";
import plantaIcon2 from "../img/plantacion2.png";
import plantaIcon3 from "../img/plantacion3.png";
import deleteIcon from "../img/boton-eliminar_2.png";

// Array de imágenes en orden
const plantas = [plantaIcon1, plantaIcon2, plantaIcon3];


export function Taskcard({ task, onDelete }) {
    // Selecciona la imagen basada en el id de la tarea
    const imagenSeleccionada = plantas[(task.id - 1) % plantas.length];
    
    return (
        <div className="main1">
            <div className="cuadro">
                <button className="boton-eliminar" onClick={onDelete}>
                    <img src={deleteIcon} alt="Eliminar" />
                </button>

                <div className="icono">
                    <img src={imagenSeleccionada} alt="Planta" /> {/* Imagen dinámica */}
                </div>


                <h2 className="tituloParcela">{task.nombreParcela}</h2>
                <p className="parrafo">Para lograr una buena cosecha, se deben tener en cuenta algunos aspectos clave.</p>
                <Link to={`/gestionTareas/${task.id}`} className="boton-ver-mas">Ver más</Link>

                
            </div>
        </div>
    );
}


