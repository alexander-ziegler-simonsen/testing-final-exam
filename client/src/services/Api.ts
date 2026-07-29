import axios from 'axios';

export const api = axios.create({
    // baseURL: `https://${import.meta.env.API_HOST || 'localhost'}:${import.meta.env.API_PORT || '5028'}/api`,
    baseURL: `http://${import.meta.env.API_HOST || 'localhost'}:${import.meta.env.API_PORT || '5028'}/api`,
    headers: { 'Content-Type': 'application/json' },
});

// todo - add this later - used to check token before each request
// axios request interceptors - run before any request is sent.
// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem('token');
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//     return config;
// })