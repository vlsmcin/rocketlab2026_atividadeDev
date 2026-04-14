import axios from 'axios';

import { AUTH_TOKEN_STORAGE_KEY } from '../context/authContext';

const api = axios.create({
    baseURL: 'http://localhost:8000',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    } else if (config.headers.Authorization) {
        delete config.headers.Authorization;
    }

    return config;
});

export default api;