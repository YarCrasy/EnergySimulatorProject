import axios from "axios";

//scp -P 14784 -r .../Web/dist/* rbp.local:/var/www/web
const api = axios.create({
  baseURL: "https://dam-project.yarcrasy.com/api",
});

export default api;
