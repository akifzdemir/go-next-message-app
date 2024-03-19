import { RoomRequest } from "../types/ws";
import { instance as axios } from "./axiosInstance";

const createRoom = (data: RoomRequest) => axios.post("/ws/create-room", data);

export { createRoom };
