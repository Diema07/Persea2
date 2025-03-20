import axios from 'axios';

// 1. Crear una instancia de Axios con configuración global
const preparacionAPI = axios.create({
    baseURL: 'http://localhost:8000/preparacion/api/v1/PreparacionTerreno/',
    withCredentials: true,  // Permite el uso de cookies
});

// 2. Función para obtener el CSRF token 
const getCSRFToken = async () => {
    const response = await axios.get('http://localhost:8000/api/csrf/', { withCredentials: true });
    return response.data.csrfToken;
};

// 3. Obtener todas las preparaciones (opcional, por si lo necesitas)
export const getAllPreparaciones = async () => {
    try {
        const response = await preparacionAPI.get('/');
        return response.data;
    } catch (error) {
        console.error('Error al obtener las preparaciones:', error.response?.data || error);
    }
};

// 4. Obtener preparaciones filtradas por ID de plantación
export const getPreparacionByPlantacionId = async (plantacionId) => {
    try {
        const response = await preparacionAPI.get(`?plantacionId=${plantacionId}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener la preparación de terreno:', error.response?.data || error);
    }
};

export const patchPreparacion = async (plantacionId, data) => {
  try {
    // Verifica que plantacionId sea un número
    const plantacionIdNumber = Number(plantacionId);
    if (isNaN(plantacionIdNumber)) {
      throw new Error("plantacionId debe ser un número");
    }

    // Obtén el CSRF token
    const csrfToken = await getCSRFToken();

    // Realiza la solicitud PATCH
    const response = await preparacionAPI.patch(`/${plantacionIdNumber}/`, data, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error al actualizar la preparación de terreno:', error.response?.data || error);
    throw error;
  }
};