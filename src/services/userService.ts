import { api } from "./api";

// ✅ GET USERS
export const getUsers = () => {
    return api.get("/users");
};

// ✅ CREATE USER
export const createUser = (data: any) => {
    return api.post("/users", data);
};

// ✅ UPDATE USER
export const updateUser = (id: number, data: any) => {
    return api.put(`/users/${id}`, data);
};