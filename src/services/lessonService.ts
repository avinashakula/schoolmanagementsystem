import { api } from "./api";

export const getLessons = () => {
    return api.get("/lessons");
};

export const getLessonsBySubject = (subjectId: number) => {
    return api.get(`/lessons/subject/${subjectId}`);
};

export const createLesson = (data: any) => {
    return api.post("/lessons", data);
};

export const updateLesson = (id: number, data: any) => {
    return api.put(`/lessons/${id}`, data);
};