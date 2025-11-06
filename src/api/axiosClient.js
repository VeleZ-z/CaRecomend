import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10_000,
});

axiosClient.interceptors.request.use((config) => {
  // Here we could inject auth headers when backend is ready.
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Normalise error responses for the UI.
    return Promise.reject(error?.response ?? error);
  },
);

export default axiosClient;
