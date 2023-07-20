import axios, { AxiosInstance } from "axios";
import { BASE_URL_API } from "../configs/server.config";
import jwtInterceptor from "../interceptors/jwt.interceptor";

const http = axios.create({
    baseURL: BASE_URL_API,
    withCredentials: true,
});

export class BaseService {
    protected httpClientPublic: AxiosInstance;
    protected httpClientPrivate: AxiosInstance;

    constructor() {
        this.httpClientPublic = http;
        this.httpClientPrivate = jwtInterceptor;
    }
}
