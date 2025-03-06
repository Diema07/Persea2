import '../styles/plantacion-inicio.css';
import '../styles/modalCrear.css'; 
import React, { useEffect, useState } from 'react';
import { getAllTasks } from '../api/plantaciones.api';
import { Taskcard } from './plantacion-crear'; 
import { useForm } from 'react-hook-form';
import { createTask } from '../api/plantaciones.api';
import Header from "./Header";


// Importaciones de Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

export function PlantacionInicio() {
    const [plantaciones, setPlantaciones] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

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
    


    // Funciones  modal
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

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

    return (
        <>
        <Header/>
            <div className='main'>
                <div className='orden'>
                    <h2>Mis Plantaciones</h2>
                    {/* Botón que abre el modal */}
                    <button onClick={openModal} className="button">Crear Plantación</button>
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
                        320: { slidesPerView: 1 },  // Extra para pantallas muy pequeñas
                        480: { slidesPerView: 1 },  
                        768: { slidesPerView: 2 },  
                        1024: { slidesPerView: 3 }  
                    }}
                >
                    {plantaciones.map((plantacion) => (
                        <SwiperSlide key={plantacion.id}>
                            <Taskcard task={plantacion} />
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Modal */}
                {isModalOpen && (
                    <div className="modal">
                        <div className="modal-content">
                            <h2>Nombre de tu parcela</h2>
                            {/* Aquí está el formulario para crear la plantación dentro del modal */}
                            <form onSubmit={onSubmit}>
                                <input
                                    type="text"
                                    placeholder="nombre"
                                    {...register("nombreParcela", { required: true })}
                                />
                                {errors.nombreParcela && <span>Requerido</span>}
                                <div className="button-container">
                                    <button type="submit">Cosechar</button>
                                    <button type="button" onClick={closeModal}>Cancelar</button>
                                </div>
                            </form>
                                
                                
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
