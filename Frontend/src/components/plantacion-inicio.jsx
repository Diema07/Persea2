import '../styles/plantacion-inicio.css';
import '../styles/modalCrear.css'; 
import React, { useEffect, useState } from 'react';
import { getAllTasks, getFilteredTasks, updateTaskState } from '../api/plantaciones.api';
import { Taskcard } from './plantacion-crear'; 
import { useForm } from 'react-hook-form';
import { createTask } from '../api/plantaciones.api';
import Header from "./Header";
import advertencia from '../img/advertencia.png'

// Importaciones de Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

export function PlantacionInicio() {
    const [plantaciones, setPlantaciones] = useState([]);
    
    // Estados para los dos modales
    const [isModalOpenCrear, setIsModalOpenCrear] = useState(false); 
    const [isModalOpenEliminar, setIsModalOpenEliminar] = useState(false); 
    const [plantacionSeleccionada, setPlantacionSeleccionada] = useState(null);

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

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
    
    // Funciones para abrir/cerrar modales
    const openModalCrear = () => setIsModalOpenCrear(true);
    const closeModalCrear = () => setIsModalOpenCrear(false);

    const openModalEliminar = (plantacion) => {
        setPlantacionSeleccionada(plantacion);  // Guardamos la plantación seleccionada
        setIsModalOpenEliminar(true);
    };
    const closeModalEliminar = () => setIsModalOpenEliminar(false);

    // Lógica del formulario
    const onSubmit = handleSubmit(async (data) => {
        console.log('Datos enviados:', data);
        try {
            await createTask(data);
            window.location.href = '/inicio-plantacion';
        } catch (error) {
            console.error('Error al crear la plantación:', error);
        }
    });

    // Función para actualizar el estado de la plantación a false (desactivar)
    const handleDeactivate = async (id) => {
        try {
            await updateTaskState(id, false);  // Cambiar el estado de la plantación a false
            // Refrescar la lista para reflejar los cambios
            const response = await getFilteredTasks();
            setPlantaciones(response.data);
        } catch (error) {
            console.error('Error al desactivar la plantación:', error);
        }
        closeModalEliminar(); // Cerrar el modal después de desactivar
    };

    return (
        
            <div className='main'>
                <div className='orden'>
                    <h2>Mis Plantaciones</h2>
                    
                    <button onClick={openModalCrear} className="button">Crear Plantación</button>
                </div>

                {/* Swiper envuelve las plantaciones */}
                <Swiper
                    modules={[Navigation, Pagination]}
                    loop={false}
                    slidesPerView={3}
                    centeredSlides={false}
                    spaceBetween={2}
                    navigation
                    pagination={{ clickable: true }}
                    className="swiper-container"
                    breakpoints={{
                        320: { slidesPerView: 1 }, 
                        480: { slidesPerView: 1 },  
                        768: { slidesPerView: 2 },  
                        1024: { slidesPerView: 2 },  
                        1280: { slidesPerView: 3 }  
                    }}
                >
                    {plantaciones.map((plantacion) => (
                        <SwiperSlide key={plantacion.id}>
                            <Taskcard 
                                task={plantacion} 
                                onDelete={() => openModalEliminar(plantacion)}
                                onDeactivate={() => handleDeactivate(plantacion.id)}  // Pasar la función de desactivar
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Modal para crear plantación */}
                {isModalOpenCrear && (
                    <div className="modal-1">
                        <div className="modal-content">
                            <h2>Nombre de tu parcela</h2>
                            <form onSubmit={onSubmit}>
                                <input
                                    type="text"
                                    className='input-1'
                                    placeholder="nombre"
                                    {...register("nombreParcela", { required: true })}
                                />
                                {errors.nombreParcela && <span>Requerido</span>}
                                <div className="button-container">
                                    <button type="submit" className='submit-1'>Plantar</button>
                                    <button type="button" className=" button-1" onClick={closeModalCrear}>Cancelar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal para eliminar plantación */}
                {isModalOpenEliminar && plantacionSeleccionada && (
                    <div className="modal-overlay-2">
                        <div className="modal-2">
                            <img src={advertencia} alt="Advertencia" className='img-advertencia' />
                            <h3>¿Estás seguro/a de eliminar esta plantación?</h3>
                            <p>Tu plantación de "<label className="parcela-1">{plantacionSeleccionada.nombreParcela}</label>" será eliminada. ¿Estás seguro/a?</p>
                            <button className="confirmar" onClick={() => handleDeactivate(plantacionSeleccionada.id)}>Sí, eliminar</button>
                            <button className="cancelar" onClick={closeModalEliminar}>Cancelar</button>
                        </div>
                    </div>
                )}
            </div>
        
    );
}
