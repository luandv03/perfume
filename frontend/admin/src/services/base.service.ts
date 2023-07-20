import axios, { AxiosInstance } from "axios";
import { API_BASE_URL } from "../configs/server.config";
import jwtInterceptor from "../interceptors/jwt.interceptor";

export const http = axios.create({
    baseURL: API_BASE_URL,
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
