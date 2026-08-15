import api from "./axios";
import { API_ROUTES } from "../constants/apiRoutes";

export const getBudgets = () =>
    api.get(API_ROUTES.BUDGETS.ROOT);

export const getCurrentMonthBudgetData = () =>
    api.get(API_ROUTES.BUDGETS.CURRENT_MONTH);
