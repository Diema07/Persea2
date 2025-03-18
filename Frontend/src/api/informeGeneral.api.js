import axios from 'axios';

// Configuración del cliente Axios para nuestra API
const api = axios.create({
  baseURL: 'http://localhost:8000/informes/', // Asegúrate de que esta URL coincida con la configuración de tus URLs en Django
  withCredentials: true,  // Permite el uso de cookies
});

// Función para obtener las plantaciones completas con la fecha de cosecha más reciente
export const getPlantacionesCosechaReciente = async () => {
  try {
    const response = await api.get('plantaciones-cosecha-reciente/');
    return response.data;
  } catch (error) {
    console.error('Error al obtener las plantaciones con cosecha reciente:', error);
    throw error;
  }
};
