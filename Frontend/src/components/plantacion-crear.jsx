import "../styles/plantacionCrear.css"; 
import { Link } from 'react-router-dom';

//imagenes
import plantaIcon from "../img/planta.png";
import deleteIcon from "../img/boton-eliminar.png";

export function Taskcard({ task, onDelete }) {
    return (
        <div className="main1">
            <div className="cuadro">
                <button className="boton-eliminar" onClick={onDelete}>
                    <img src={deleteIcon} alt="Eliminar" />
                </button>

                <div className="icono">
                    <img src={plantaIcon} alt="Planta" />
                </div>

                <h2 className="titulo">{task.nombreParcela}</h2>
                <p className="parrafo">Para lograr una buena cosecha, se deben tener en cuenta algunos aspectos clave.</p>
                <Link to={`/gestionTareas/${task.id}`} className="boton-ver-mas">Ver más</Link>

                
            </div>
        </div>
    );
}
