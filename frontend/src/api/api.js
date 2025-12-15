// src/api/api.js
import axios from "axios";

const BASE_URL = "https://blog-yt-2-6xw0.onrender.com"; // your deployed backend

const api = axios.create({
  baseURL: BASE_URL + "/api/v1",  // prepend /api/v1
  withCredentials: true,
});

export default api;
