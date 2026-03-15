
import axios from "axios";

const API = axios.create({
  baseURL: "https://fdapp-cy7o.onrender.com",
  // baseURL: process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/api",
  
  withCredentials: true //  refresh token 
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;