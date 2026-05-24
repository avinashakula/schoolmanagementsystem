import { api } from "./api";

// ✅ Get all buses
export const getBuses = () => {
  return api.get("/buses");
};

// ✅ Add new bus
export const createBus = (data) => {
  return api.post("/buses", data);
};

// (optional) Get single bus
export const getBusById = (id) => {
  return api.get(`/buses/${id}`);
};

export const getBusOccupancy = () => {
  return api.get("/buses/occupancy");
};
