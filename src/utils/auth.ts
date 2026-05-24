import { api } from "../services/api";

export const loginUser = (data: {
  email: string;
  password: string;
}) => {
  return api.post("/login", data);
};

export const registerUser = (data: {
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  city: string;
  password: string;
}) => {
  return api.post("/register", data);
};