import { api } from "./client";

export const createQuitPlan = async (data: {
  startDate: string;
  dailyCigarettes: number;
  packPrice: number;
  packSize: number;
  yearsSmoking: number;
  motivation?: string;
}) => {
  const res = await api.post("/quit-plans", data);
  return res.data;
};

export const getCurrentQuitPlan = async () => {
  const res = await api.get("/quit-plans/current");
  return res.data;
};

export const updateQuitPlan = async (data: {
  startDate?: string;
  dailyCigarettes?: number;
  packPrice?: number;
  packSize?: number;
}) => {
  const res = await api.patch("/quit-plans/current", data);
  return res.data;
};
