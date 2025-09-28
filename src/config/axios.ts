import axios from "axios";

const axiosBase = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": 'application/json'
    },
    withCredentials: true,
});

export default axiosBase;