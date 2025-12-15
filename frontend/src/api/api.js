import axios from "axios";

const api = axios.create({
  baseURL: "https://blog-yt-2-6xw0.onrender.com/api/v1", // your deployed backend URL
  withCredentials: true
});

export default api;
