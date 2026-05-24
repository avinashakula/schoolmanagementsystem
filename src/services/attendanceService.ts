import { api } from "./api";

export const getStudentsByClass = (className: string) => {
    return api.get(`/attendance/students/${className}`);
};

export const getAttendance = (className: string, date: string) => {
    return api.get(`/attendance?className=${className}&date=${date}`);
};

export const saveAttendance = (data: any) => {
    return api.post("/attendance", data);
};

export const getStudentAttendanceReport = (
    filters: any
) => {
    return api.get("/attendance/student-report", {
        params: filters,
    });
};

export const markRFIDAttendance = (payload: any) => {
    return api.post("/attendance/rfid", payload);
};