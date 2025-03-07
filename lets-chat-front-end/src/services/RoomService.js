import { httpClient } from "../configs/AxiosHelper";



export const createRoomApi = async (roomDetails) => {

    const response = await httpClient.post(`/room/add-room`, roomDetails);
    return response.data;
}


export const joinRoomApi = async (roomId) => {
    const response = await httpClient.get(`/room/get-room/${roomId}`, roomId);
    return response.data;
}


export const getMessageApi = async (roomId) => {
    const response = await httpClient.get(`/room/get-room/${roomId}`);
    return response.data.data.messages;
}