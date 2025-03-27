import axios from 'axios';

// Instancia de Axios para RiegoFertilizacion
const riegoAPI = axios.create({
  baseURL: 'http://localhost:8000/mantenimiento/api/v1/RiegoFertilizacion/',
  withCredentials: true,
});

// Obtener CSRF token
const getCSRFToken = async () => {
  const response = await axios.get('http://localhost:8000/api/csrf/', { withCredentials: true });
  return response.data.csrfToken;
};

// 1) Obtener todos los registros de RiegoFertilizacion (opcional)
export const getAllRiegoFertilizacion = async () => {
  try {
    const response = await riegoAPI.get('/');
    return response.data;
  } catch (error) {
    console.error('Error al obtener todos los registros de Riego/Fertilización:', error.response?.data || error);
    throw error;
  }
};

// 2) Obtener registros por ID de plantación (GET)
export const getRiegoByPlantacionId = async (plantacionId) => {
  try {
    const plantacionIdNumber = Number(plantacionId);
    if (isNaN(plantacionIdNumber)) {
      throw new Error("plantacionId debe ser un número");
    }

    const response = await riegoAPI.get(`?plantacionId=${plantacionIdNumber}`);
    return response.data; // array de RiegoFertilizacion
  } catch (error) {
    console.error('Error al obtener Riego/Fertilización:', error.response?.data || error);
    throw error;
  }
};

// 3) Obtener detalle de un registro por su ID (GET)
export const getRiegoFertilizacionById = async (id) => {
  try {
    const idNumber = Number(id);
    if (isNaN(idNumber)) {
      throw new Error("El ID debe ser un número");
    }

    const response = await riegoAPI.get(`${idNumber}/`);
    return response.data; // objeto RiegoFertilizacion
  } catch (error) {
    console.error('Error al obtener detalle de Riego/Fertilización:', error.response?.data || error);
    throw error;
  }
};

// 4) Crear un nuevo registro de RiegoFertilizacion (POST)
export const postRiegoFertilizacion = async (data) => {
  try {
    const csrfToken = await getCSRFToken();

    // Verifica que los datos sean un objeto válido
    if (!data || typeof data !== 'object') {
      throw new Error("Los datos deben ser un objeto válido");
    }

    // Envía la solicitud POST
    const response = await riegoAPI.post('/', data, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
        
    });
    console.log(response.csrfToken);

    // Retorna la respuesta del servidor
    return response.data;
  } catch (error) {
    console.error('Error al crear Riego/Fertilización:', error.response?.data || error);
    throw error;
  }
};

// 5) Actualizar un registro de RiegoFertilizacion (PATCH)
export const patchRiegoFertilizacion = async (id, data) => {
  try {
    const idNumber = Number(id);
    if (isNaN(idNumber)) {
      throw new Error("El ID debe ser un número");
    }

    const csrfToken = await getCSRFToken();

    // Envía la solicitud PATCH
    const response = await riegoAPI.patch(`${idNumber}/`, data, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
    });

    // Retorna la respuesta del servidor
    return response.data;
  } catch (error) {
    console.error('Error al actualizar Riego/Fertilización:', error.response?.data || error);
    throw error;
  }
};