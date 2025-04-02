// plantaciones.api.js

import axios from 'axios';

// Configuración global de Axios
const taskAPI = axios.create({
    baseURL: 'http://localhost:8000/plantaciones/api/v1/Plantacion/',
    withCredentials: true,  // Permite el uso de cookies
});

//Manejo de imagen de perfil
const imagenProfile = axios.create({
    baseURL: 'http://localhost:8000/api/usuarios/imagenPerfil/', // Asegúrate de que coincida con la URL base de tus endpoints de usuarios
    withCredentials: true,  // Permite el envío de cookies en las peticiones
});


// Función para obtener el CSRF token
const getCSRFToken = async () => {
    const response = await axios.get('http://localhost:8000/api/csrf/', { withCredentials: true });
    return response.data.csrfToken;
};

export const getProfileImage = async () => {
    try {
        const csrfToken = await getCSRFToken();
        const response = await imagenProfile.get('', {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
        });
        return response.data; // Se espera un objeto { profile_picture: 'url_de_la_imagen' }
    } catch (error) {
        console.error('Error al obtener la imagen de perfil:', error.response?.data || error);
        throw error;
    }
}

export const getAllTasks = () => taskAPI.get('/');

// Función para obtener las plantaciones filtradas (estado = True) desde la nueva vista
export const getFilteredTasks = () => axios.get('http://localhost:8000/plantaciones/api/v1/PlantacionFiltrada/', { withCredentials: true });



// Crear una nueva plantación po
export const createTask = async (task) => {
    try {
        const csrfToken = await getCSRFToken();
        const response = await taskAPI.post('/', task, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
        });
        console.log(csrfToken);
        console.log(response.data);
    } catch (error) {
        console.error('Error al crear la plantación:', error.response?.data || error);
    }
};

export const getPlantacionById = (id) => taskAPI.get(`/${id}`);

// Actualizar el estado (PATCH)
export const updateTaskState = async (id, newState) => {
    try {
        const csrfToken = await getCSRFToken();
        const response = await taskAPI.patch(`${id}/`, { estado: newState }, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error al actualizar el estado de la plantación:', error.response?.data || error);
        throw error;
    }
};


export const getEstadoTareas = async (plantacionId) => {
    try {
        const response = await axios.get(`http://localhost:8000/plantaciones/api/v1/Plantacion/${plantacionId}/estado-tareas/`, {
            withCredentials: true,  // Asegúrate de incluir las credenciales si es necesario
        });
        return response.data;  // Devuelve solo los datos de la respuesta
    } catch (error) {
        console.error("Error obteniendo el estado de tareas:", error);
        throw error;  // Relanza el error para que pueda ser manejado en el componente
    }
}

