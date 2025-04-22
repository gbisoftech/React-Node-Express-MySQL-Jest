import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // or from your auth context/store
    const stored = localStorage.getItem('auth');
    const user = stored ? JSON.parse(stored) : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (user) {
      config.user = { id: user.id };
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
