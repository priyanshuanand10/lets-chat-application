import axios from "axios";


export const baseUrl= import.meta.env.VITE_BASE_URL
export const httpClient = axios.create({
    baseURL: baseUrl,
    headers:{
        "Authorization":"Basic cHJpeWFtOnByaXlhbQ=="
    }
})