import { api } from "./api";

export const getFees = (year: number) =>
    api.get(`/fees/${year}`);

export const saveFees = (data: any) =>
    api.post("/fees", data);

export const getFeeByClass = (year: number, cls: string) =>
    api.get(`/fees/${year}/${cls}`);

export const getPayments = (studentId: number) =>
    api.get(`/fees/payments/${studentId}`);

export const addPayment = (data: any) =>
    api.post(`/fees/payments`, data);

export const getPaymentSummary = (studentId: number) => {
    return api.get(`/fees/payments/summary/${studentId}`);
};