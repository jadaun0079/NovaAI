import axios from "axios";

const api=axios.create({
    baseURL:import.meta.env.VITE_SERVER_URL,
    withCredentials:true
})

// Add response interceptor to check for index.html SPA redirect pages (which have text/html type)
api.interceptors.response.use(
    (response) => {
        const contentType = response.headers['content-type'];
        if (contentType && contentType.includes('text/html')) {
            return Promise.reject(new Error('Received HTML response instead of JSON. The VITE_SERVER_URL might be misconfigured, or the endpoint does not exist.'));
        }
        // Also check raw string response data if it looks like HTML
        if (typeof response.data === 'string' && response.data.trim().startsWith('<!DOCTYPE html')) {
            return Promise.reject(new Error('Received HTML payload instead of JSON.'));
        }
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;


