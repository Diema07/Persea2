import "../styles/plantacionCrear.css";
import plantaIcon from "../img/planta.png";
import { Link,  } from 'react-router-dom';

export function Taskcard({ task }) {
    return (
        <div className="main1">
            <Link to={`/gestionTareas/${task.id}`} className="link">
                <div className="cuadro">
                    {/* Parte izquierda */}
                    <div className="parte-izquierda">
                        <h1>{task.nombreParcela}</h1>
                        <div className="icono">
                            <img src={plantaIcon} alt="Planta" />
                        </div>
                    </div>

                
                    <div className="dividir"></div>

                    {/* Parte derecha */}
                    <div className="parte-derecha">
                        <h2>Recomendación</h2>
                        <p>Para lograr una buena cosecha, se deben tener en cuenta algunos aspectos clave.</p>
                    </div>
                </div>
            </Link>
        </div>
    );
}
