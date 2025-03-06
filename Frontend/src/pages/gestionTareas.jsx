import "../styles/gestionTareas.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { getPlantacionById } from "../api/plantaciones.api"; 
import Header from "../components/Header";
import logo1 from "../img/img1.png";
import logo2 from "../img/img2.png";
import logo3 from "../img/img3.png";
import logo4 from "../img/img4.png";
import logo5 from "../img/img5.png";
import logo6 from "../img/img6.png";

export function GestionTareasPage() {
  const { plantacionId } = useParams();
  const navigate = useNavigate();
  const [nombreParcela, setNombreParcela] = useState("");

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

    fetchPlantacion();
  }, [plantacionId]);

  return (
    <>
    <Header/>
    <div className="main-8">
      <div className="contenedor3">
        <h2 className="titulo">Gestión de Tareas - {nombreParcela}</h2>
        <div className="grid-container">

          <Link to={`/preparacion/${plantacionId}/`} className="grid-item">
            <img src={logo1} alt="Preparación" className="icono" />
            <p>Preparación del terreno</p>
          </Link>

          <Link to={`/seleccion-arboles/${plantacionId}/`} className="grid-item">
            <img src={logo2} alt="Selección" className="icono" />
            <p>Selección de árboles</p>
          </Link>

          <Link to={`/riego-fertilizacion/${plantacionId}/`} className="grid-item">
            <img src={logo3} alt="Riego" className="icono" />
            <p>Gestión de Riego</p>
          </Link> 

          <Link to={`/mantenimiento-monitoreo/${plantacionId}/`} className="grid-item">
            <img src={logo4} alt="Mantenimiento" className="icono" />
            <p>Mantenimiento</p>
          </Link>

          <Link to={`/poda/${plantacionId}/`} className="grid-item">
            <img src={logo5} alt="Poda" className="icono" />
            <p>Poda</p>
          </Link>

          <Link to={`/cosecha/${plantacionId}/`} className="grid-item">
            <img src={logo6} alt="Cosecha" className="icono" />
            <p>Cosecha</p>
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}

export default GestionTareasPage;
