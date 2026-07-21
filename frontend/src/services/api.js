import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Altere para a URL do seu backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;