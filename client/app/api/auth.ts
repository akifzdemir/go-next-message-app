import { LoginRequest, RegisterRequest } from "../types/auth";
import { instance as axios } from "./axiosInstance";

const login = (data: LoginRequest) => axios.post("/login", data);

const register = (data: RegisterRequest) => axios.post("/register", data);

export { login, register };
