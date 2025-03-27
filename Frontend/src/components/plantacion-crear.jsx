import "../styles/plantacionCrear.css";
import { Link } from 'react-router-dom';

// Imágenes
import plantaIcon1 from "../img/plantacion1.png";
import plantaIcon2 from "../img/plantacion2.png";
import plantaIcon3 from "../img/plantacion3.png";
import deleteIcon from "../img/boton-eliminar_2.png";

// array de imágenes
const plantas = [plantaIcon1, plantaIcon2, plantaIcon3];

// array de párrafos
const parrafos = [
  
    "Mantén el suelo húmedo pero no encharcado. Un riego adecuado es clave, especialmente en los primeros años.",
    "Poda regularmente para dar forma al árbol y eliminar ramas muertas. Esto mejora la salud y el crecimiento.",
    "Cosecha los aguacates cuando alcancen su madurez fisiológica. Manipula los frutos con cuidado para evitar daños.",
    "Almacena los aguacates en un lugar fresco y ventilado. Un buen manejo post-cosecha asegura su calidad.",
    "Mantén el área libre de malezas para evitar que compitan por nutrientes y agua con el árbol.",
    "Protege los árboles de heladas y vientos fuertes con barreras naturales o artificiales.",
    "Elige variedades resistentes y utiliza injertos para mejorar la calidad de los frutos y la salud del árbol."
];
export function Taskcard({ task, onDelete }) {
    // selecciona la imagen basada en el id de la tarea
    
    let indice = task.id - 1; 
    indice = indice % plantas.length; 
    const imagenSeleccionada = plantas[indice]; 

    // selecciona el párrafo basado en el id de la tarea
    let indiceParrafo = task.id - 1; 
    indiceParrafo = indiceParrafo % parrafos.length; 
    const parrafoSeleccionado = parrafos[indiceParrafo]; 

    return (
        <div className="main1">
            <div className="cuadro">
                <button className="boton-eliminar" onClick={onDelete}>
                    <img src={deleteIcon} alt="Eliminar" />
                </button>

                <div className="icono">
                    <img src={imagenSeleccionada} alt="Planta" />
                </div>

                <h2 className="tituloParcela">{task.nombreParcela}</h2>
                <p className="parrafo">{parrafoSeleccionado}</p>
                <Link to={`/gestionTareas/${task.id}`} className="boton-ver-mas">Ver tareas</Link>
            </div>
        </div>
    );
}