
import api from "./api";
import type { Identifier } from "@models/common";
import type { Receiver, ReceiverPayload } from "@models/domain/receiver";

const RESOURCE = "/consumer-element";

const handleError = (error: any, fallbackMessage: string): never => {
  console.error(fallbackMessage, error);
  throw new Error(error.response?.data?.message || fallbackMessage);
};

export const receiverApi = {
  getAll: async (): Promise<Receiver[]> => {
    try {
      const { data } = await api.get<Receiver[]>(RESOURCE);
      return data;
    } catch (error) {
      handleError(error, "Error al cargar receivers");
    }
  },

  create: async (data: ReceiverPayload): Promise<Receiver> => {
    try {
      const response = await api.post<Receiver>(RESOURCE, data);
      return response.data;
    } catch (error) {
      handleError(error, "Error al crear");
    }
  },

  update: async (id: Identifier, data: ReceiverPayload): Promise<Receiver> => {
    try {
      const response = await api.put<Receiver>(`${RESOURCE}/${id}`, data);
      return response.data;
    } catch (error) {
      handleError(error, "Error al actualizar");
    }
  },

  delete: async (id: Identifier): Promise<void> => {
    try {
      await api.delete(`${RESOURCE}/${id}`);
    } catch (error) {
      handleError(error, "Error al eliminar");
    }
  },
};
