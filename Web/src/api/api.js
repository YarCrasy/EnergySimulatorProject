import axios from "axios";

const DEFAULT_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV
    ? "http://localhost:8080/api"
    : "https://dam-project.yarcrasy.com/api");

const api = axios.create({
  baseURL: DEFAULT_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API request failed", error);
    return Promise.reject(error);
  }
);

export default api;
