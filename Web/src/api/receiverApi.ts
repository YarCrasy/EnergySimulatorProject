
import api from "./api";

const RESOURCE = "/consumer-element";

const handleError = (error, fallbackMessage) => {
  console.error(fallbackMessage, error);
  throw new Error(error.response?.data?.message || fallbackMessage);
};

export const receiverApi = {
  getAll: async () => {
    try {
      const { data } = await api.get(RESOURCE);
      return data;
    } catch (error) {
      handleError(error, "Error al cargar receivers");
    }
  },

  create: async (data) => {
    try {
      const response = await api.post(RESOURCE, data);
      return response.data;
    } catch (error) {
      handleError(error, "Error al crear");
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.put(`${RESOURCE}/${id}`, data);
      return response.data;
    } catch (error) {
      handleError(error, "Error al actualizar");
    }
  },

  delete: async (id) => {
    try {
      await api.delete(`${RESOURCE}/${id}`);
    } catch (error) {
      handleError(error, "Error al eliminar");
    }
  },
};