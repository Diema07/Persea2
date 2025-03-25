import '../styles/plantacion-inicio.css';
import '../styles/modalCrear.css'; 
import React, { useEffect, useState } from 'react';
import { getFilteredTasks, updateTaskState } from '../api/plantaciones.api';
import { Taskcard } from './plantacion-crear'; 
import { useForm } from 'react-hook-form';
import { createTask } from '../api/plantaciones.api';
import Header from "./Header";
import advertencia from '../img/advertencia.png';
import iconoPlantacion from '../img/icono-plantacion.png';
import salir1 from '../img/salir-1.png';

// Importaciones de Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

export function PlantacionInicio() {
    const [plantaciones, setPlantaciones] = useState([]);
    const [isModalOpenCrear, setIsModalOpenCrear] = useState(false); 
    const [isModalOpenEliminar, setIsModalOpenEliminar] = useState(false);
    const [isModalOpenLogout, setIsModalOpenLogout] = useState(false); // Nuevo estado para modal de logout
    const [plantacionSeleccionada, setPlantacionSeleccionada] = useState(null);
    
    const { register, handleSubmit, formState: { errors } } = useForm();

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
    
    const openModalCrear = () => setIsModalOpenCrear(true);
    const closeModalCrear = () => setIsModalOpenCrear(false);

    const openModalEliminar = (plantacion) => {
        setPlantacionSeleccionada(plantacion);
        setIsModalOpenEliminar(true);
    };
    
    const closeModalEliminar = () => setIsModalOpenEliminar(false);
    
    const onSubmit = handleSubmit(async (data) => {
        try {
            await createTask(data);
            window.location.href = '/inicio-plantacion';
        } catch (error) {
            console.error('Error al crear la plantación:', error);
        }
    });

    const handleDeactivate = async (id) => {
        try {
            await updateTaskState(id, "INACTIVA");
            const response = await getFilteredTasks();
            setPlantaciones(response.data);
        } catch (error) {
            console.error('Error al desactivar la plantación:', error);
        }
        closeModalEliminar(); 
    };

    const handleConfirmLogout = () => {
        window.location.href = "http://localhost:8000/accounts/logout/";
    };

    return (
        <div className="app-container">
            <Header onLogoutClick={() => setIsModalOpenLogout(true)} />
            <div className='main'>
                <div className='orden'>
                    <h2 className='tituloPlantacion'>Mis Plantaciones</h2>
                    <div className='union'>
                        <img src={iconoPlantacion} alt="Planta" />
                        <button onClick={openModalCrear} className="button">Crear Plantación</button>
                    </div>
                </div>

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
                        1024: { slidesPerView: 3 },  
                        1280: { slidesPerView: 4 }  
                    }}
                >
                    {plantaciones.map((plantacion) => (
                        <SwiperSlide key={plantacion.id}>
                            <Taskcard 
                                task={plantacion} 
                                onDelete={() => openModalEliminar(plantacion)}
                                onDeactivate={() => handleDeactivate(plantacion.id)}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>

                {isModalOpenCrear && (
                    <div className="modal-1">
                        <div className="modal-content">
                            <h2 className='titulo-modal'>Nombre de tu parcela</h2>
                            <form onSubmit={onSubmit}>
                                <input
                                    type="text"
                                    className='input-1'
                                    placeholder="Nombre"
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

                {isModalOpenEliminar && plantacionSeleccionada && (
                    <div className="modal-overlay-2">
                        <div className="modal-2">
                            <img src={advertencia} alt="Advertencia" className='img-advertencia' />
                            <h3>¿Estás seguro/a de eliminar esta plantación?</h3>
                            <p>Tu plantación "<label className="parcela-1">{plantacionSeleccionada.nombreParcela}</label>" será eliminada y se perderán todos los procesos realizados. ¿Estás seguro/a?</p>
                            <button className="confirmar" onClick={() => handleDeactivate(plantacionSeleccionada.id)}>Sí, eliminar</button>
                            <button className="cancelar" onClick={closeModalEliminar}>Cancelar</button>
                        </div>
                    </div>
                )}

                {isModalOpenLogout && (
                    <div className="modal-overlay-2">
                        <div className="modal-2">
                            <img src={advertencia} alt="Advertencia" className='img-advertencia' />
                            <h3>¿Estás seguro/a de cerrar sesión?</h3>
                            <p>Serás redirigido/a a la página de inicio de sesión.</p>
                            <button className="confirmar" onClick={handleConfirmLogout}>Sí, cerrar sesión</button>
                            <button className="cancelar" onClick={() => setIsModalOpenLogout(false)}>Cancelar</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}