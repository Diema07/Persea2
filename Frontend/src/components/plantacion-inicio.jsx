// plantacion-inicio.jsx

import '../styles/plantacion-inicio.css';
import React, { useEffect, useState } from 'react';
import { getFilteredTasks, updateTaskState } from '../api/plantaciones.api';
import { Link } from 'react-router-dom';

export function PlantacionInicio() {
    const [plantaciones, setPlantaciones] = useState([]);

    useEffect(() => {
        const fetchPlantaciones = async () => {
            try {
                const response = await getFilteredTasks();
                setPlantaciones(response.data);
            } catch (error) {
                console.error('Error al obtener las plantaciones:', error);
            }
        };

        fetchPlantaciones();
    }, []);

    // Función para actualizar el estado de la plantación a false
    const handleDeactivate = async (id) => {
        try {
            await updateTaskState(id, false);
            // Se refresca la lista para reflejar los cambios
            const response = await getFilteredTasks();
            setPlantaciones(response.data);
        } catch (error) {
            console.error('Error al desactivar la plantación:', error);
        }
    };

    return (
        <div>
            <h2>Mis Plantaciones</h2>
            <ul>
                {plantaciones.map((plantacion) => (
                    <li key={plantacion.id}>
                        <Link to={`/gestionTareas/${plantacion.id}`}>
                            {plantacion.nombreParcela}
                        </Link>
                        {/* Mostrar el botón solo si el estado es true */}
                        {plantacion.estado && (
                            <button onClick={() => handleDeactivate(plantacion.id)}>
                                Desactivar
                            </button>
                        )}
                    </li>
                ))}
            </ul>
            <Link to="/plantacion" className="omit-button">Crear Plantación</Link>
        </div>
    );
}
