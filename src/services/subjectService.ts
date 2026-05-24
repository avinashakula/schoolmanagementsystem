import { api } from "./api";

export const getSubjects = () => {
    return api.get("/subjects");
};

export const createSubject = (data: any) => {
    return api.post("/subjects", data);
};

export const getFacultySubjectWiseCount = () => {
    return api.get("/subjects/faculty-count");
};