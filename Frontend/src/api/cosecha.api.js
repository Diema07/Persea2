import axios from 'axios';

const cosechaAPI = axios.create({
  baseURL: 'http://localhost:8000/produccion/api/v1/Cosecha/',
  withCredentials: true,
});

// Obtener CSRF token
const getCSRFToken = async () => {
  const response = await axios.get('http://localhost:8000/api/csrf/', { withCredentials: true });
  return response.data.csrfToken;
};

export const getALLcosecha = async () => {
  try {
    const response = await cosechaAPI.get('/');
    return response.data;
  } catch (error) {
    console.error('Error al obtener las cosechas:', error.response?.data || error);
  }
};

export const getCosechaByPlantacionId = async (plantacionId) => {
  try {
    const response = await cosechaAPI.get(`?plantacionId=${plantacionId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener Cosecha:', error.response?.data || error);
  }
};

export const postCosecha = async (data) => {
  console.log("Datos a enviar:", data);
  try {
    const csrfToken = await getCSRFToken();
    const response = await cosechaAPI.post(`/`, data, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear cosecha:', error.response?.data || error);
    throw error;
  }
};
