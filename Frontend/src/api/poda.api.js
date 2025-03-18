// src/api/poda.api.js
import axios from 'axios';

// Instancia de Axios para Poda
const podaAPI = axios.create({
  baseURL: 'http://localhost:8000/mantenimiento/api/v1/Poda/',
  withCredentials: true,
});

// Obtener CSRF token
const getCSRFToken = async () => {
  const response = await axios.get('http://localhost:8000/api/csrf/', { withCredentials: true });
  return response.data.csrfToken;
};

// 1) Obtener todos los registros de Poda (opcional)
export const getAllPoda = async () => {
  try {
    const response = await podaAPI.get('/');
    return response.data;
  } catch (error) {
    console.error('Error al obtener los registros de Poda:', error.response?.data || error);
  }
};

// 2) Obtener registros por ID de plantación (GET)
export const getPodaByPlantacionId = async (plantacionId) => {
  try {
    const response = await podaAPI.get(`?plantacionId=${plantacionId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener Poda por ID de plantación:', error.response?.data || error);
  }
};

// 3) Crear un nuevo registro de Poda (POST)
export const postPoda = async (data) => {
  try {
    const csrfToken = await getCSRFToken();
    const response = await podaAPI.post(`/`, data, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear Poda:', error.response?.data || error);
    throw error;
  }
};
