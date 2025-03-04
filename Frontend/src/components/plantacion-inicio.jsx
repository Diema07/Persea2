import '../styles/plantacion-inicio.css';
import React, { useEffect, useState } from 'react';
import { getAllTasks } from '../api/plantaciones.api';
import { Link } from 'react-router-dom';

export function PlantacionInicio() {
    const [plantaciones, setPlantaciones] = useState([]);

    useEffect(() => {
        const fetchPlantaciones = async () => {
            try {
                const response = await getAllTasks();
                setPlantaciones(response.data);
            } catch (error) {
                console.error('Error al obtener las plantaciones:', error);
            }
        };

        fetchPlantaciones();
    }, []);

    return (
        <div>
            <h2>Mis Plantaciones</h2>
            <ul>
                {plantaciones.map((plantacion) => (
                    <li key={plantacion.id}>
                        <Link to={`/gestionTareas/${plantacion.id}`}>
                            {plantacion.nombreParcela}
                        </Link>
                    </li>
                ))}
            </ul>
            <Link to="/plantacion" className="omit-button">Crear Plantación</Link>
        </div>
    );
}