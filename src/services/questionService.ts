import { api } from "./api";

export const getQuestions = () => {
    return api.get("/questions");
};

export const createQuestion = (data: any) => {
    return api.post("/questions", data);
};

export const updateQuestion = (id: number, data: any) => {
    return api.put(`/questions/${id}`, data);
};

export const deleteQuestion = (id: number) => {
    return api.delete(`/questions/${id}`);
};