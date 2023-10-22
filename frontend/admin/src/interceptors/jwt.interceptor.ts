import axios from "axios";
import { API_BASE_URL } from "../configs/server.config";

const jwtInterceptor = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

jwtInterceptor.interceptors.request.use(
    function (config) {
        const access_token = localStorage.getItem("access_token");

        config.headers["Authorization"] = "Bearer " + access_token;

        // Do something before request is sent
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

jwtInterceptor.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const refresh_token = localStorage.getItem("refresh_token");

        if (error.response.status === 401) {
            await axios
                .get(`${API_BASE_URL}/admin/account/refresh_token`, {
                    headers: {
                        Authorization: `Bearer ${refresh_token}`,
                        "Content-Type": "application/json",
                    },
                })
                .then((response) => {
                    localStorage.setItem(
                        "access_token",
                        response.data.data.access_token
                    );
                })
                .catch((err) => {
                    return err.response;
                });
            return axios(error.config);
        } else {
            return error.response;
        }
    }
);

export default jwtInterceptor;
