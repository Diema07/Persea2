import "../styles/gestionTareas.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { getPlantacionById,getEstadoTareas } from "../api/plantaciones.api"; 
import logo1 from "../img/img1.png";
import logo2 from "../img/img2.png";
import logo3 from "../img/img3.png";
import logo4 from "../img/img4.png";
import logo5 from "../img/img5.png";
import logo6 from "../img/img6.png";
import atras from "../img/atras.png";


export function GestionTareasPage() {
  const { plantacionId } = useParams();
  const navigate = useNavigate();
  const [nombreParcela, setNombreParcela] = useState("");
  const [estado, setEstado] = useState({ preparacion: false, seleccion: false,});

  useEffect(() => {
    const fetchPlantacion = async () => {
      try {
        const response = await getPlantacionById(plantacionId);
        setNombreParcela(response.data.nombreParcela); 
      } catch (error) {
        console.error("Error obteniendo la plantación:", error);
        setNombreParcela("Error");
      }
    };

    const fetchEstadoTareas = async () => {
      try {
        const data = await getEstadoTareas(plantacionId);
        console.log("Datos recibidos:", data);  // Log de depuración
        // data = { preparacion: true/false, seleccion: true/false }
        setEstado(data);
      } catch (error) {
        console.error("Error obteniendo el estado de tareas:", error);
      }
    };

    fetchPlantacion();
    fetchEstadoTareas();
  }, [plantacionId]);

  const handleRedirectToInicioPlantacion = () => {
    navigate(`/inicio-plantacion`);
  };

  // Solo si preparacion y seleccion están completadas => se desbloquean las demás
  const tareasDesbloqueadas = estado.preparacion && estado.seleccion;

  const handleBlockedClick = (e) => {
    e.preventDefault();
    alert("Debes completar 'Preparación' y 'Selección' antes de acceder a las demás tareas.");
  };

  return (
    <>

    <div className="main-8">

      <button
        onClick={handleRedirectToInicioPlantacion}
      >
        <img 
          src={atras} 
          alt="Flecha atras" 
          style={{ width: '35px', height: '35px' }} // Ajusta el tamaño de la flecha
        />
      </button>
      

      <div className="contenedor3">
        <h2 className="titulo">Gestión de Tareas - {nombreParcela}</h2>
        <div className="grid-contenedor">

          <Link to={`/preparacion/${plantacionId}/`} className="grid-cuadro">
            <img src={logo1} alt="Preparación" className="icono" />
            <p>Preparación del terreno</p>
          </Link>

          <Link to={`/seleccion-arboles/${plantacionId}/`} className="grid-cuadro">
            <img src={logo2} alt="Selección" className="icono" />
            <p>Selección de árboles</p>
          </Link>

           {/* Riego (bloqueado si !tareasDesbloqueadas) */}
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
              <img src={logo6} alt="Informe" className="icono" />
              <p>Informe</p>
            </Link>
          ) : (
            <div className="grid-cuadro disabled" onClick={handleBlockedClick}>
              <img src={logo6} alt="Informe" className="icono" />
              <p>Informe</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

export default GestionTareasPage;
