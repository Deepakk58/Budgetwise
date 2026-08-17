import api from "./axios";
import { API_ROUTES } from "../constants/apiRoutes";

export const addGroupExpense = (groupId, data) =>
    api.post(`${API_ROUTES.GROUP_EXPENSES.ROOT}/${groupId}`, data);

export const deleteGroupExpense = (groupId, expenseId) =>
    api.delete(`${API_ROUTES.GROUP_EXPENSES.ROOT}/${groupId}/${expenseId}`);
