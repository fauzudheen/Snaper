import axios from "axios";
import { API_BASE_URL } from "./urls";
import { store } from "../redux/store";

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
    const token = store.getState().auth.accessToken;
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;