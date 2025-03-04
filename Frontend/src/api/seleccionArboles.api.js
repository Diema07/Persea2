import axios from 'axios';

// 1. Crear una instancia de Axios con configuración global
const seleccionAPI = axios.create({
  baseURL: 'http://localhost:8000/preparacion/api/v1/SeleccionArboles/',
  withCredentials: true,  // Permite el uso de cookies
});

// 2. Función para obtener el CSRF token (igual que en preparacionTerreno.api.js)
const getCSRFToken = async () => {
  const response = await axios.get('http://localhost:8000/api/csrf/', { withCredentials: true });
  return response.data.csrfToken;
};

export const getAllSelecciones = async () => {
    try {
        const response = await seleccionAPI.get('/');
        return response.data;
    } catch (error) {
        console.error('Error al obtener las preparaciones:', error.response?.data || error);
    }
};

// 3. Obtener selecciones filtradas por ID de plantación
export const getSeleccionByPlantacionId = async (plantacionId) => {
  try {
    const response = await seleccionAPI.get(`/?plantacionId=${plantacionId}`);
    // console.log(response.data)
    return response.data;  // Retornamos el array final
  } catch (error) {
    console.error('Error al obtener la selección de árboles:', error.response?.data || error);
  }
};

// 4. PATCH para actualizar un registro de Selección de Árboles
export const patchSeleccion = async (plantacionId, data) => {
  try {
    // Verifica que plantacionId sea un número
    const plantacionIdNumber = Number(plantacionId);
    if (isNaN(plantacionIdNumber)) {
      throw new Error("plantacionId debe ser un número");
    }

    // Obtén el CSRF token
    const csrfToken = await getCSRFToken();

    // Realiza la solicitud PATCH
    const response = await seleccionAPI.patch(`/${plantacionIdNumber}/`, data, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error al actualizar la selección de árboles:', error);
    throw error;
  }
};
