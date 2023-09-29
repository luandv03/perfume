import axios from "axios";
import { BASE_URL_API } from "../configs/server.config";

const jwtInterceptor = axios.create({
    baseURL: BASE_URL_API,
    headers: {
        "Content-Type": "application/json",
    },
});

jwtInterceptor.interceptors.request.use(
    function (config) {
        const access_token_user = localStorage.getItem("access_token_user");

        config.headers["Authorization"] = "Bearer " + access_token_user;

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
        const refresh_token_user = localStorage.getItem("refresh_token_user");

        if (error.response.status === 401) {
            await axios
                .get(`${BASE_URL_API}/auth/customer/refresh_token`, {
                    headers: {
                        Authorization: `Bearer ${refresh_token_user}`,
                        "Content-Type": "application/json",
                    },
                })
                .then((response) => {
                    localStorage.setItem(
                        "access_token_user",
                        response.data.data.access_token_user
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
