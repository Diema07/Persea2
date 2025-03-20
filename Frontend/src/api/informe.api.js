// src/api/informe.api.js
import axios from 'axios';

// 1. Crear instancia de Axios con configuración base
const informeAPI = axios.create({
  baseURL: 'http://localhost:8000/informes/',
  withCredentials: true, // Permite el uso de cookies (si lo necesitas)
});

// 2. Función para obtener el CSRF token (si tu backend lo requiere)
const getCSRFToken = async () => {
  const response = await axios.get('http://localhost:8000/api/csrf/', {
    withCredentials: true,
  });
  return response.data.csrfToken;
};

// 3. Obtener informe completo en JSON
export const getInformeCompleto = async (plantacionId) => {
  try {
    // Llama a la ruta /informes/api/v1/informe-completo/<plantacionId>/
    // Ajusta según tu URL exacta en urls.py
    const response = await informeAPI.get(`informe-completo/${plantacionId}/`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener informe completo:', error.response?.data || error);
    throw error;
  }
};

// 4. Descargar informe en PDF
export const descargarInformeCompletoPDF = (plantacionId) => {
  // Simplemente abrimos la URL con ?formato=pdf
  window.open(`http://localhost:8000/informes/informe-completo/${plantacionId}/?formato=pdf`);
};


export const InformeHtml = async (plantacionId) => {
  
  try {
    const csrfToken = await getCSRFToken();
    const response = await informeAPI.get(
      `http://localhost:8000/informes/informe-completo/${plantacionId}/?formato=html`,
      {
        headers: { 
          'Content-Type': 'text/html' },
          'X-CSRFToken': csrfToken,
      });
  return response.data;
} catch (error) {
  console.error('Error al obtener el informe HTML:', error);

  }
};

// 5. (Opcional) Crear un registro de Informe en la BD (si usas el modelo Informe)
export const postInforme = async (data) => {
  try {
    const csrfToken = await getCSRFToken();
    const response = await informeAPI.post(`/Informe/`, data, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear el informe:', error.response?.data || error);
    throw error;
  }
};

