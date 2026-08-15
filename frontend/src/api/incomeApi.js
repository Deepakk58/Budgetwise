import api from "./axios";
import { API_ROUTES } from "../constants/apiRoutes";

export const getIncomes = () =>
    api.get(API_ROUTES.INCOMES.ROOT);

export const addIncome = (data) =>
    api.post(API_ROUTES.INCOMES.ROOT, data);

export const updateIncome = (id, data) =>
    api.patch(`${API_ROUTES.INCOMES.ROOT}/${id}`, data);

export const deleteIncome = (id) =>
    api.delete(`${API_ROUTES.INCOMES.ROOT}/${id}`);
