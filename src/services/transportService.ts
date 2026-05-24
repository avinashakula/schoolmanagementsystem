import { api } from "./api";

export const getTransportByClass = (className: string) => {
    return api.get(`/transport/${className}`);
};

export const saveTransport = (data: any) => {
    return api.post("/transport", data);
};