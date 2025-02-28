import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BASE_PATH;

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// // Optional: Add interceptors for auth tokens
// httpClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });


export default httpClient;