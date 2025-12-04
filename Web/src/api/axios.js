import axios from "axios";

export default axios.create({
  baseURL: "https://dam-project.yarcrasy.com/api", // << tu backend
  headers: {
    "Content-Type": "application/json",
  },
});
