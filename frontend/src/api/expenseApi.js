import api from "./axios";
import { API_ROUTES } from "../constants/apiRoutes";

export const getExpenses = () =>
    api.get(API_ROUTES.EXPENSES.ROOT);

export const addExpense = (data) =>
    api.post(API_ROUTES.EXPENSES.ROOT, data);

export const updateExpense = (id, data) =>
    api.patch(`${API_ROUTES.EXPENSES.ROOT}/${id}`, data);

export const deleteExpense = (id) =>
    api.delete(`${API_ROUTES.EXPENSES.ROOT}/${id}`);
