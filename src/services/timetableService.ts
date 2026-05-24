import { api } from "./api";

export const getTimetableByClass = (className) => {
    return api.get(`/timetable/class/${className}`);
};

export const saveTimetable = (data: any) => {
    return api.post(`/timetable/class/${data.class_name}`, data);
};