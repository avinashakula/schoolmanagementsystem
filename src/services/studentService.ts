import { api } from "./api";

export const createStudent = (data: any) => {
    return api.post("/students", data);
};

export const getStudents = () => {
    return api.get("/students");
};

export const updateStudent = (id: number, data: any) => {
    return api.put(`/students/${id}`, data);
};

export const getStudentClassWiseCount = () => {
    return api.get("/students/class-wise-count");
};