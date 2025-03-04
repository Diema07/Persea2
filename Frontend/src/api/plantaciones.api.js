import axios from 'axios';

// Configuración global de Axios
const taskAPI = axios.create({
    baseURL: 'http://localhost:8000/plantaciones/api/v1/Plantacion/',
    withCredentials: true,  // Permite el uso de cookies
});

// Función para obtener el CSRF token
const getCSRFToken = async () => {
    const response = await axios.get('http://localhost:8000/api/csrf/', { withCredentials: true });
    return response.data.csrfToken;
};

export const getAllTasks = () => taskAPI.get('/');  // No se necesita pasar config

// Crear una nueva plantación
export const createTask = async (task) => {
    try {
        const csrfToken = await getCSRFToken();  // Obtener el CSRF token antes de hacer la solicitud

        const response = await taskAPI.post('/', task, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,  // Incluir el CSRF token en la petición
            },
        });

        console.log(response.data);
    } catch (error) {
        console.error('Error al crear la plantación:', error.response?.data || error);
    }
};

export const getPlantacionById = (id)=> taskAPI.get('/${id}');