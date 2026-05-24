import { api } from "./api";

export const createFaculty = (data: any) => {
    return api.post("/faculty", data);
};

export const getFaculty = () => {
    return api.get("/faculty");
};