import axios from "axios";

//scp -P 14784 -r ./Web/dist/* dam-project.yarcrasy.com:/var/www/web
export default axios.create({
  baseURL: "https://dam-project.yarcrasy.com/api", // << tu backend
  headers: {
    "Content-Type": "application/json",
  },
});
