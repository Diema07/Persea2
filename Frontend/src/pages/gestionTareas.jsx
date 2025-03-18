import "../styles/gestionTareas.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { getPlantacionById, getEstadoTareas } from "../api/plantaciones.api"; 
import logo1 from "../img/img1.png";
import logo2 from "../img/img2.png";
import logo3 from "../img/img3.png";
import logo4 from "../img/img4.png";
import logo5 from "../img/img5.png";
import logo6 from "../img/img6.png";
import logo7 from "../img/img7.png";
import logo8 from "../img/img8.png";
import advertencia from "../img/advertencia.png";

export function GestionTareasPage() {
  const { plantacionId } = useParams();
  const navigate = useNavigate();
  const [nombreParcela, setNombreParcela] = useState("");
  const [estado, setEstado] = useState({ preparacion: false, seleccion: false });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Primero obtenemos la información de la plantación
    const fetchPlantacion = async () => {
      try {
        const response = await getPlantacionById(plantacionId);
        console.log("Respuesta de getPlantacionById:", response);
        const data = response.data;
        console.log("Datos de la plantación:", data);
        setNombreParcela(data.nombreParcela);
        
        // Si la propiedad 'estado' indica "COMPLETA", redirige al inicio
        if (data.estado && data.estado.toUpperCase() === "COMPLETA") {
          console.log("La plantación está COMPLETA. Redirigiendo a /inicio-plantacion");
          navigate(`/inicio-plantacion`);
          return; // Evitamos que se ejecute la lógica siguiente en este efecto
        }
      } catch (error) {
        console.error("Error obteniendo la plantación:", error);
        setNombreParcela("Error");
      }
    };

    // Se mantiene la lógica original para obtener el estado de tareas
    const fetchEstadoTareas = async () => {
      try {
        const data = await getEstadoTareas(plantacionId);
        console.log("Respuesta de getEstadoTareas:", data);
        setEstado(data);
      } catch (error) {
        console.error("Error obteniendo el estado de tareas:", error);
      }
    };

    fetchPlantacion();
    fetchEstadoTareas();
  }, [plantacionId, navigate]);

  // Solo se desbloquean las demás tareas si 'preparacion' y 'seleccion' están completadas
  const tareasDesbloqueadas = estado.preparacion && estado.seleccion;

  const handleBlockedClick = (e) => {
    e.preventDefault();
    setIsModalOpen(true); 
  };

  return (
    <>
      <div className="main-8">
        <div className="contenedor3">
          <h2 className="titulo-gestion">Gestión de Tareas - {nombreParcela}</h2>
          <div className="grid-contenedor">
            <Link to={`/preparacion/${plantacionId}/`} className="grid-cuadro">
              <img src={logo1} alt="Preparación" className="icono" />
              <p>Preparación del terreno</p>
            </Link>

            <Link to={`/seleccion-arboles/${plantacionId}/`} className="grid-cuadro">
              <img src={logo2} alt="Selección" className="icono" />
              <p>Selección de árboles</p>
            </Link>

            {tareasDesbloqueadas ? (
              <Link to={`/riego-fertilizacion/${plantacionId}/`} className="grid-cuadro">
                <img src={logo3} alt="Riego" className="icono" />
                <p>Gestión de Riego</p>
              </Link>
            ) : (
              <div className="grid-cuadro disabled" onClick={handleBlockedClick}>
                <img src={logo3} alt="Riego" className="icono" />
                <p>Gestión de Riego</p>
              </div>
            )}

            {tareasDesbloqueadas ? (
              <Link to={`/mantenimiento-monitoreo/${plantacionId}/`} className="grid-cuadro">
                <img src={logo4} alt="Mantenimiento" className="icono" />
                <p>Mantenimiento</p>
              </Link>
            ) : (
              <div className="grid-cuadro disabled" onClick={handleBlockedClick}>
                <img src={logo4} alt="Mantenimiento" className="icono" />
                <p>Mantenimiento</p>
              </div>
            )}

            {tareasDesbloqueadas ? (
              <Link to={`/poda/${plantacionId}/`} className="grid-cuadro">
                <img src={logo5} alt="Poda" className="icono" />
                <p>Poda</p>
              </Link>
            ) : (
              <div className="grid-cuadro disabled" onClick={handleBlockedClick}>
                <img src={logo5} alt="Poda" className="icono" />
                <p>Poda</p>
              </div>
            )}

            {tareasDesbloqueadas ? (
              <Link to={`/cosecha/${plantacionId}/`} className="grid-cuadro">
                <img src={logo6} alt="Cosecha" className="icono" />
                <p>Cosecha</p>
              </Link>
            ) : (
              <div className="grid-cuadro disabled" onClick={handleBlockedClick}>
                <img src={logo6} alt="Cosecha" className="icono" />
                <p>Cosecha</p>
              </div>
            )}

            {tareasDesbloqueadas ? (
              <Link to={`/informe-completo/${plantacionId}/`} className="grid-cuadro">
                <img src={logo7} alt="Informe" className="icono" />
                <p>Informe</p>
              </Link>
            ) : (
              <div className="grid-cuadro disabled" onClick={handleBlockedClick}>
                <img src={logo7} alt="Informe" className="icono" />
                <p>Informe</p>
              </div>
            )}

            {/* Volver al inicio */}
            <Link to={`/inicio-plantacion`} className="grid-cuadro-volver">
              <img src={logo8} alt="volver al inicio" className="icono" />
              <p>Volver al inicio</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Modal de advertencia */}
      {isModalOpen && (
        <div className="modal-overlay-2">
          <div className="modal-2">
            <img src={advertencia} alt="Advertencia" className="img-advertencia" />
            <h3>Debes completar 'Preparación' y 'Selección'</h3>
            <p>
              Para acceder a esta tarea, primero debes completar las tareas de{" "}
              <strong>Preparación</strong> y <strong>Selección</strong>.
            </p>
            <button className="confirmar" onClick={() => setIsModalOpen(false)}>
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default GestionTareasPage;
