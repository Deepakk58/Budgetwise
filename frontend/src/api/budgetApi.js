import api from "./axios";
import { API_ROUTES } from "../constants/apiRoutes";

export const getBudgets = () =>
    api.get(API_ROUTES.BUDGETS.ROOT);

export const getCurrentMonthBudgetData = () =>
    api.get(API_ROUTES.BUDGETS.CURRENT_MONTH);

export const getCategories = () =>
    api.get(API_ROUTES.BUDGETS.CATEGORIES);

export const setMultipleBudgets = (budgets) =>
    api.put(API_ROUTES.BUDGETS.MULTIPLE, { budgets });

