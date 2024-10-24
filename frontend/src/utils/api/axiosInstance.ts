import axios from "axios";
import { API_BASE_URL } from "../../utils/api/urls";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
    const token = useSelector((state: RootState) => state.auth.accessToken);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance