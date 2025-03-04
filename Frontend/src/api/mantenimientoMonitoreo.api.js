// src/api/mantenimiento.api.js
import axios from 'axios';

// Instancia de Axios para Mantenimiento/Monitoreo
const mantenimientoAPI = axios.create({
  baseURL: 'http://localhost:8000/mantenimiento/api/v1/MantenimientoMonitoreo/',
  withCredentials: true,
});

// Obtener CSRF token
const getCSRFToken = async () => {
  const response = await axios.get('http://localhost:8000/api/csrf/', { withCredentials: true });
  return response.data.csrfToken;
};

// 1) Obtener todos los mantenimientos (opcional)
export const getAllMantenimiento = async () => {
  try {
    const response = await mantenimientoAPI.get('/');
    return response.data;
  } catch (error) {
    console.error('Error al obtener los mantenimientos :', error.response?.data || error);
  }
};

// 2) Obtener registros por ID de plantación (GET)
export const getMantenimientoByPlantacionId = async (plantacionId) => {
  try {
    const response = await mantenimientoAPI.get(`?plantacionId=${plantacionId}`);
    return response.data; 
  } catch (error) {
    console.error('Error al obtener Mantenimiento/Monitoreo:', error.response?.data || error);
  }
};

// 3) Crear un nuevo mantenimiento (POST)
export const postMantenimientoMonitoreo = async ( data) => {
  try {

    const csrfToken = await getCSRFToken();
    // Hacemos POST a la URL base, enviando el objeto data
    const response = await mantenimientoAPI.post(`/`, data,{
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear Mantenimiento/Monitoreo:', error.response?.data || error);
    throw error;
  }
};
