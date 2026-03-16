import axios from "axios";

const DEFAULT_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? "https://damt-project.yarcrasy.com/api"
    : "http://localhost:8080/api");

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
