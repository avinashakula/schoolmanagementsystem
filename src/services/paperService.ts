import { api } from "./api";

// CREATE PAPER
export const createPaper = async (payload: any) => {
    return api.post("/papers", payload);
};

// GET PAPERS
export const getPapers = async () => {
    return api.get("/papers");
};

// DELETE PAPER
export const deletePaper = async (id: number) => {
    return api.delete(`/papers/${id}`);
};

// UPDATE PAPER STATUS
export const updatePaperStatus = async (
    id: number,
    data: any,
) => {
    return api.put(`/papers/${id}/status`, data);
};

// UPDATE PAPER
export const updatePaper = async (
    id: number,
    payload: any,
) => {
    return api.put(`/papers/${id}`, payload);
};

export const getPaperById = async (id: number) => {
    return api.get(`/papers/${id}`);
};