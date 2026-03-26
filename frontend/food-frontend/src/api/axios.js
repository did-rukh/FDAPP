
import axios from "axios";

const API = axios.create({
  // baseURL: import.meta.env.VITE_BACKEND_URL, 
    baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api",   // last one
    withCredentials: true //  refresh token 
    });

    //  baseURL: "http://localhost:5000/api",
  // baseURL: import.meta.env.VITE_BACKEND_URL || "https://fdapp-cy7o.onrender.com/api",
    // baseURL: "https://fdapp-cy7o.onrender.com/api",
    // withCredentials: true, //  important for cookies

//  });
 API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;