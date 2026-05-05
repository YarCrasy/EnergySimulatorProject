import axios from "axios";

const defaultBaseUrl =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? "https://dam.yarcrasy.com/api" : "http://localhost:8080/api");

const api = axios.create({
  baseURL: defaultBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth:token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const status = axios.isAxiosError(error) ? error.response?.status : undefined;

    if (status !== 401 && status !== 403) {
      console.error("API request failed", error);
    }

    return Promise.reject(error);
  },
);

export default api;
