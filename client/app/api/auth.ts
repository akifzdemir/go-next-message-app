import { LoginRequest, RegisterRequest } from "../types/auth";
import { instance as axios } from "./axiosInstance";

const login = (data: LoginRequest) => axios.post("/user/login", data);

const register = (data: RegisterRequest) => axios.post("/user/register", data);

export { login, register };
