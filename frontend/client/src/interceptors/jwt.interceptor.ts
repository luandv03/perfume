import axios from "axios";
import { BASE_URL_API } from "../configs/server.config";

const jwtInterceptor = axios.create({
    baseURL: BASE_URL_API,
    withCredentials: true,
});

jwtInterceptor.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response.status === 401) {
            await axios
                .get(`${BASE_URL_API}/auth/customer/refresh_token`, {
                    withCredentials: true,
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
