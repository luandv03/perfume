import axios from "axios";
import { API_BASE_URL } from "../configs/server.config";

const jwtInterceptor = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

jwtInterceptor.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response.statusCode === 401) {
            await axios
                .get(
                    "http://localhost:4000/api/v1/admin/account/refresh_token",
                    {
                        withCredentials: true,
                    }
                )
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
