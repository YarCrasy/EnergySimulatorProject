import axios from "axios";

const api = axios.create({
  baseURL: "https://dam-project.yarcrasy.com/api",
});

export default api;
